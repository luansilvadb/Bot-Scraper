import { Injectable } from '@nestjs/common';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProfitFilter {
    /**
     * Determine the status of a scraped product based on its discount.
     * If discount >= 80%, it requires manual approval (PENDING_APPROVAL).
     * If discount < 80%, we might auto-approve or ignore (logic can be expanded).
     * For MVP, let's say all products with any discount are stored, 
     * but only high discounts are flagged for visual approval.
     */
    evaluate(discountPercentage: number): ProductStatus {
        if (discountPercentage >= 80) {
            return ProductStatus.PENDING_APPROVAL;
        }

        // For now, let's assume we want to review anything that has a discount 
        // but we automatically "APPROVE" lower discounts if they are still good?
        // Actually, the spec says "Visual interface to Approve/Reject high-discount items".
        // "Profit filters (>80% discount errors/flash deals)".

        return ProductStatus.APPROVED; // Or a status that implies "not flagged"
    }

    isHighValue(discountPercentage: number): boolean {
        return discountPercentage >= 80;
    }
}
