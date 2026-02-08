import React from 'react';
import {
  Skeleton,
  SkeletonItem,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

export interface CardSkeletonProps {
  count?: number;
  cardHeight?: number;
}

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: tokens.spacingHorizontalM,
  },
  card: {
    height: '120px',
    padding: tokens.spacingHorizontalM,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  title: {
    width: '60%',
    height: '20px',
  },
  content: {
    width: '100%',
    height: '16px',
  },
  subtitle: {
    width: '40%',
    height: '14px',
  },
});

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  count = 8,
  cardHeight = 120,
}) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      {[...Array(count)].map((_, index) => (
        <div key={index} className={styles.card} style={{ height: cardHeight }}>
          <Skeleton>
            <SkeletonItem className={styles.title} />
            <SkeletonItem className={styles.content} />
            <SkeletonItem className={styles.subtitle} />
          </Skeleton>
        </div>
      ))}
    </div>
  );
};

CardSkeleton.displayName = 'CardSkeleton';
