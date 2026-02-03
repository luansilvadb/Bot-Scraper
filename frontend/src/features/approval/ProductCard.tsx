import React from 'react';
import {
    Card,
    CardHeader,
    CardFooter,
    CardPreview,
    Text,
    Button,
    Badge,
    makeStyles,
    shorthands,
    tokens,
} from '@fluentui/react-components';
import {
    Checkmark20Filled,
    Dismiss20Filled
} from '@fluentui/react-icons';

const useStyles = makeStyles({
    card: {
        width: '300px',
        maxWidth: '100%',
        height: 'fit-content',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.06)'),
        transition: 'background-color 0.3s ease',
        ':hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
        }
    },
    preview: {
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: tokens.colorNeutralBackground2,
    },
    image: {
        maxHeight: '100%',
        maxWidth: '100%',
        objectFit: 'contain',
    },
    badge: {
        position: 'absolute',
        top: '12px',
        right: '12px',
    },
    priceContainer: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('4px'),
    },
    originalPrice: {
        textDecorationLine: 'line-through',
        color: tokens.colorNeutralForeground4,
    }
});

interface ProductCardProps {
    product: any;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    isLoading?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onApprove, onReject, isLoading }) => {
    const styles = useStyles();

    return (
        <Card className={styles.card}>
            <CardPreview className={styles.preview}>
                <img src={product.imageUrl} alt={product.title} className={styles.image} />
                <Badge appearance="filled" color="important" className={styles.badge}>
                    {product.discountPercentage}% OFF
                </Badge>
            </CardPreview>

            <CardHeader
                header={<Text weight="semibold" truncate>{product.title}</Text>}
                description={<Text size={200}>{product.bot?.name || 'Manual'}</Text>}
            />

            <div style={{ padding: '0 12px' }}>
                <div className={styles.priceContainer}>
                    <Text size={500} weight="bold" color="brand">
                        R$ {product.currentPrice.toFixed(2)}
                    </Text>
                    <Text size={200} className={styles.originalPrice}>
                        R$ {product.originalPrice.toFixed(2)}
                    </Text>
                </div>
            </div>

            <CardFooter>
                <Button
                    icon={<Checkmark20Filled />}
                    appearance="primary"
                    onClick={() => onApprove(product.id)}
                    disabled={isLoading}
                >
                    Approve
                </Button>
                <Button
                    icon={<Dismiss20Filled />}
                    onClick={() => onReject(product.id)}
                    disabled={isLoading}
                >
                    Reject
                </Button>
            </CardFooter>
        </Card>
    );
};
