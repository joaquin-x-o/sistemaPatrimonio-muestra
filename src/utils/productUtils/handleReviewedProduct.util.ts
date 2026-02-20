import { Product } from "../../entities/Product";

export function handleReviewReason(product: Product, newReason: string) {

    let finalReason = newReason;

    if (product.isPendingReview && product.pendingReviewReason) {
        finalReason = `${newReason} (Revisión previa: ${product.pendingReviewReason})`;
    }

    return finalReason;
}