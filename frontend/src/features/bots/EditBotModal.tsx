import {
    Dialog,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogContent,
    Toaster,
    useToastController,
    Toast,
    ToastTitle,
    ToastBody,
    useId,
} from '@fluentui/react-components';
import { BotForm } from './BotForm';
import { useUpdateBot } from './api';
import type { Bot, CreateBotInput, UpdateBotInput } from './api';

interface EditBotModalProps {
    bot: Bot;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditBotModal({ bot, open, onOpenChange }: EditBotModalProps) {
    const toasterId = useId('edit-bot-toaster');
    const { dispatchToast } = useToastController(toasterId);

    const updateBot = useUpdateBot();

    const handleSubmit = (data: CreateBotInput | UpdateBotInput) => {
        updateBot.mutate(
            { id: bot.id, ...data },
            {
                onSuccess: () => {
                    dispatchToast(
                        <Toast>
                            <ToastTitle>Bot updated successfully!</ToastTitle>
                            <ToastBody>Your changes have been saved.</ToastBody>
                        </Toast>,
                        { intent: 'success' }
                    );
                    onOpenChange(false);
                },
                onError: (error) => {
                    dispatchToast(
                        <Toast>
                            <ToastTitle>Failed to update bot</ToastTitle>
                            <ToastBody>{error.message || 'An error occurred'}</ToastBody>
                        </Toast>,
                        { intent: 'error' }
                    );
                },
            }
        );
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <>
            <Toaster toasterId={toasterId} />
            <Dialog open={open} onOpenChange={(_, data) => onOpenChange(data.open)}>
                <DialogSurface style={{ width: '90%', maxWidth: '500px' }}>
                    <DialogBody>
                        <DialogTitle>Edit Bot: {bot.name}</DialogTitle>
                        <DialogContent>
                            <BotForm
                                initialData={bot}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                                isLoading={updateBot.isPending}
                                mode="edit"
                            />
                        </DialogContent>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>
    );
}
