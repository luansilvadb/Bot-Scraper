import { Button } from '@fluentui/react-components';
import { Add24Regular } from '@fluentui/react-icons';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import { FormModal } from '@/components/FormModal';
import { BotForm } from './BotForm';
import { useCreateBot } from './api';
import type { CreateBotInput, UpdateBotInput } from './api';

export function CreateBotModal() {
  const { isOpen, open, close } = useModal();
  const toast = useToast();
  const createBot = useCreateBot();

  const handleSubmit = (data: CreateBotInput | UpdateBotInput) => {
    createBot.mutate(data as CreateBotInput, {
      onSuccess: () => {
        toast.showSuccess('The bot has been added to your list.', 'Bot created successfully!');
        close();
      },
      onError: (error) => {
        toast.showError(error.message || 'An error occurred', 'Failed to create bot');
      },
    });
  };

  const handleCancel = () => {
    close();
  };

  return (
    <>
      <toast.ToasterComponent />
      <Button appearance="primary" icon={<Add24Regular />} onClick={open}>
        Create Bot
      </Button>
      <FormModal
        title="Create New Bot"
        isOpen={isOpen}
        onClose={handleCancel}
        size="large"
      >
        <BotForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createBot.isPending}
          mode="create"
        />
      </FormModal>
    </>
  );
}

