import { FormModal } from '@/components/FormModal';
import { useToast } from '@/hooks/useToast';
import { BotForm } from './BotForm';
import { useUpdateBot } from './api';
import type { Bot, CreateBotInput, UpdateBotInput } from './api';

interface EditBotModalProps {
  bot: Bot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBotModal({ bot, open, onOpenChange }: EditBotModalProps) {
  const toast = useToast();
  const updateBot = useUpdateBot();

  const handleSubmit = (data: CreateBotInput | UpdateBotInput) => {
    updateBot.mutate(
      { id: bot.id, ...data },
      {
        onSuccess: () => {
          toast.showSuccess('Your changes have been saved.', 'Bot updated successfully!');
          onOpenChange(false);
        },
        onError: (error) => {
          toast.showError(error.message || 'An error occurred', 'Failed to update bot');
        },
      }
    );
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <>
      <toast.ToasterComponent />
      <FormModal
        title={`Edit Bot: ${bot.name}`}
        isOpen={open}
        onClose={handleCancel}
        size="large"
      >
        <BotForm
          initialData={bot}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={updateBot.isPending}
          mode="edit"
        />
      </FormModal>
    </>
  );
}
