import React, { useState, useEffect } from 'react';
import {
    Field,
    Input,
    Button,
    makeStyles,
    shorthands,
} from '@fluentui/react-components';
import type { CreateProductInput, UpdateProductInput, Product } from './api';

const useStyles = makeStyles({
    form: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('16px'),
        paddingTop: '16px',
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        ...shorthands.gap('16px'),
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        ...shorthands.gap('8px'),
        paddingTop: '8px',
    },
});

interface ProductFormProps {
    mode: 'create' | 'edit';
    initialData?: Product;
    onSubmit: (data: CreateProductInput | UpdateProductInput) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

interface FormData {
    asin: string;
    title: string;
    currentPrice: string;
    originalPrice: string;
    discountPercentage: string;
    imageUrl: string;
    productUrl: string;
}

interface FormErrors {
    asin?: string;
    title?: string;
    currentPrice?: string;
    originalPrice?: string;
    discountPercentage?: string;
    imageUrl?: string;
    productUrl?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
    mode,
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
}) => {
    const styles = useStyles();

    const [formData, setFormData] = useState<FormData>({
        asin: '',
        title: '',
        currentPrice: '',
        originalPrice: '',
        discountPercentage: '',
        imageUrl: '',
        productUrl: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (initialData && mode === 'edit') {
            setFormData({
                asin: initialData.asin || '',
                title: initialData.title || '',
                currentPrice: initialData.currentPrice?.toString() || '',
                originalPrice: initialData.originalPrice?.toString() || '',
                discountPercentage: initialData.discountPercentage?.toString() || '',
                imageUrl: initialData.imageUrl || '',
                productUrl: initialData.productUrl || '',
            });
        }
    }, [initialData, mode]);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.asin.trim() && mode === 'create') {
            newErrors.asin = 'ASIN is required';
        }

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        const currentPrice = parseFloat(formData.currentPrice);
        if (isNaN(currentPrice) || currentPrice < 0) {
            newErrors.currentPrice = 'Current price must be a positive number';
        }

        const originalPrice = parseFloat(formData.originalPrice);
        if (isNaN(originalPrice) || originalPrice < 0) {
            newErrors.originalPrice = 'Original price must be a positive number';
        }

        const discount = parseInt(formData.discountPercentage, 10);
        if (isNaN(discount) || discount < 0 || discount > 100) {
            newErrors.discountPercentage = 'Discount must be between 0 and 100';
        }

        if (!formData.imageUrl.trim() || !isValidUrl(formData.imageUrl)) {
            newErrors.imageUrl = 'Valid image URL is required';
        }

        if (!formData.productUrl.trim() || !isValidUrl(formData.productUrl)) {
            newErrors.productUrl = 'Valid product URL is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        if (mode === 'create') {
            const createData: CreateProductInput = {
                asin: formData.asin,
                title: formData.title,
                currentPrice: parseFloat(formData.currentPrice),
                originalPrice: parseFloat(formData.originalPrice),
                discountPercentage: parseInt(formData.discountPercentage, 10),
                imageUrl: formData.imageUrl,
                productUrl: formData.productUrl,
            };
            onSubmit(createData);
        } else {
            const updateData: UpdateProductInput = {
                title: formData.title,
                currentPrice: parseFloat(formData.currentPrice),
                originalPrice: parseFloat(formData.originalPrice),
                discountPercentage: parseInt(formData.discountPercentage, 10),
                imageUrl: formData.imageUrl,
                productUrl: formData.productUrl,
            };
            onSubmit(updateData);
        }
    };

    const handleChange = (field: keyof FormData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {mode === 'create' && (
                <Field
                    label="ASIN"
                    required
                    validationState={errors.asin ? 'error' : 'none'}
                    validationMessage={errors.asin}
                >
                    <Input
                        value={formData.asin}
                        onChange={handleChange('asin')}
                        placeholder="B0XXXXXXXXX"
                    />
                </Field>
            )}

            <Field
                label="Title"
                required
                validationState={errors.title ? 'error' : 'none'}
                validationMessage={errors.title}
            >
                <Input
                    value={formData.title}
                    onChange={handleChange('title')}
                    placeholder="Product title"
                />
            </Field>

            <div className={styles.row}>
                <Field
                    label="Current Price"
                    required
                    validationState={errors.currentPrice ? 'error' : 'none'}
                    validationMessage={errors.currentPrice}
                >
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.currentPrice}
                        onChange={handleChange('currentPrice')}
                        placeholder="49.99"
                    />
                </Field>

                <Field
                    label="Original Price"
                    required
                    validationState={errors.originalPrice ? 'error' : 'none'}
                    validationMessage={errors.originalPrice}
                >
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.originalPrice}
                        onChange={handleChange('originalPrice')}
                        placeholder="99.99"
                    />
                </Field>
            </div>

            <Field
                label="Discount Percentage"
                required
                validationState={errors.discountPercentage ? 'error' : 'none'}
                validationMessage={errors.discountPercentage}
            >
                <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={handleChange('discountPercentage')}
                    placeholder="50"
                />
            </Field>

            <Field
                label="Image URL"
                required
                validationState={errors.imageUrl ? 'error' : 'none'}
                validationMessage={errors.imageUrl}
            >
                <Input
                    value={formData.imageUrl}
                    onChange={handleChange('imageUrl')}
                    placeholder="https://example.com/image.jpg"
                />
            </Field>

            <Field
                label="Product URL"
                required
                validationState={errors.productUrl ? 'error' : 'none'}
                validationMessage={errors.productUrl}
            >
                <Input
                    value={formData.productUrl}
                    onChange={handleChange('productUrl')}
                    placeholder="https://amazon.com/dp/B0XXXXXXXXX"
                />
            </Field>

            <div className={styles.actions}>
                <Button appearance="secondary" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button appearance="primary" type="submit" disabled={isLoading}>
                    {isLoading
                        ? mode === 'create'
                            ? 'Creating...'
                            : 'Saving...'
                        : mode === 'create'
                            ? 'Create Product'
                            : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
};
