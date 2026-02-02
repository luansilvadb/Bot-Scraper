import { useState } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogContent,
    Button,
    Toaster,
    useToastController,
    Toast,
    ToastTitle,
    ToastBody,
    useId,
} from '@fluentui/react-components';
import { Add24Regular } from '@fluentui/react-icons';
import { BotForm } from './BotForm';
import { useCreateBot } from './api';
import type { CreateBotInput, UpdateBotInput } from './api';

export function CreateBotModal() {
    const [isOpen, setIsOpen] = useState(false);
    const toasterId = useId('create-bot-toaster');
    const { dispatchToast } = useToastController(toasterId);

    const createBot = useCreateBot();

    const handleSubmit = (data: CreateBotInput | UpdateBotInput) => {
        createBot.mutate(data as CreateBotInput, {
            onSuccess: () => {
                dispatchToast(
                    <Toast>
                        <ToastTitle>Bot created successfully!</ToastTitle>
                        <ToastBody>The bot has been added to your list.</ToastBody>
                    </Toast>,
                    { intent: 'success' }
                );
                setIsOpen(false);
            },
            onError: (error) => {
                dispatchToast(
                    <Toast>
                        <ToastTitle>Failed to create bot</ToastTitle>
                        <ToastBody>{error.message || 'An error occurred'}</ToastBody>
                    </Toast>,
                    { intent: 'error' }
                );
            },
        });
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    return (
        <>
            <Toaster toasterId={toasterId} />
            <Dialog open={isOpen} onOpenChange={(_, data) => setIsOpen(data.open)}>
                <DialogTrigger disableButtonEnhancement>
                    <Button appearance="primary" icon={<Add24Regular />}>
                        Create Bot
                    </Button>
                </DialogTrigger>
                <DialogSurface style={{ width: '90%', maxWidth: '500px' }}>
                    <DialogBody>
                        <DialogTitle>Create New Bot</DialogTitle>
                        <DialogContent>
                            <BotForm
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                                isLoading={createBot.isPending}
                                mode="create"
                            />
                        </DialogContent>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>
    );
}

