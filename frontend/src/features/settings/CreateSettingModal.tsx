import React from 'react';
import { Button } from '@fluentui/react-components';
import { Add20Regular } from '@fluentui/react-icons';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import { FormModal } from '@/components/FormModal';
import { SettingForm } from './SettingForm';
import { useUpsertSetting, type SystemSetting } from './api';

export const CreateSettingModal: React.FC = () => {
  const { isOpen, open, close } = useModal();
  const toast = useToast();
  const upsertSetting = useUpsertSetting();

  const handleSubmit = async (data: SystemSetting) => {
    try {
      await upsertSetting.mutateAsync(data);
      toast.showSuccess('Setting added successfully');
      close();
    } catch (error) {
      toast.showError(
        error instanceof Error ? error.message : 'An error occurred',
        'Failed to add setting'
      );
    }
  };

  return (
    <>
      <toast.ToasterComponent />
      <Button appearance="primary" icon={<Add20Regular />} onClick={open}>
        Add New Setting
      </Button>
      <FormModal
        title="Add System Setting"
        isOpen={isOpen}
        onClose={close}
        size="medium"
      >
        <SettingForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={close}
          isLoading={upsertSetting.isPending}
        />
      </FormModal>
    </>
  );
};
