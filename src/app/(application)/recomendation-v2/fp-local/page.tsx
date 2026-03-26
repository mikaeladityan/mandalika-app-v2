"use client";

import { RecomendationV2 } from "@/components/pages/recomendation-v2";

export default function RecomendationLocalV2Page() {
    return (
        <RecomendationV2
            title="Rekomendasi Bahan Lokal"
            description="Daftar kebutuhan bahan baku dari supplier lokal berdasarkan peramalan dan stok."
            type="lokal"
        />
    );
}
