"use client";

import { CreditCard, Package, Users } from "lucide-react";

export function Main() {
    return (
        <section className="">
            {/* Header Halaman */}
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Selamat datang kembali, John!</p>
            </header>

            {/* Konten Utama */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Card Stats */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Pendapatan</p>
                            <p className="text-2xl font-bold">Rp 125.000.000</p>
                        </div>
                        <CreditCard className="h-8 w-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Produk</p>
                            <p className="text-2xl font-bold">1.245</p>
                        </div>
                        <Package className="h-8 w-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Pelanggan</p>
                            <p className="text-2xl font-bold">589</p>
                        </div>
                        <Users className="h-8 w-8 text-purple-500" />
                    </div>
                </div>
            </div>
        </section>
    );
}
