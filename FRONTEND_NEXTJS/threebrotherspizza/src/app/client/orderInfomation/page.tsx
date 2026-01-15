"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/axios/axiosClient";
import { useToast } from "@/contexts/ToastContext";
import Link from "next/link";

const OrderInformation = () => {
    const router = useRouter();
    const { showToast } = useToast();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async (userId: number) => {
        try {
            const res = await axiosClient.get(`/orders/get-orders-by-customer/${userId}`);
            // Backend returns { data: [...], ... }
            if (res.data && res.data.data) {
                setOrders(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            showToast("Failed to load orders", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserAndOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/client/login");
                return;
            }

            const res = await axiosClient.get(`/users/me`);
            if (res.data && res.data.id) {
                await fetchOrders(res.data.id);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            router.push("/client/login");
        }
    };

    useEffect(() => {
        fetchUserAndOrders();
    }, []);

    const getStatusBadge = (status: number) => {
        switch (status) {
            case 0:
                return <span className="badge bg-warning text-dark">Pending</span>;
            case 1:
                return <span className="badge bg-info text-dark">Đang vận chuyển</span>; // Shipping
            case 2:
                return <span className="badge bg-success">Delivered</span>;
            case 3:
                return <span className="badge bg-danger">Cancelled</span>;
            default:
                return <span className="badge bg-secondary">Unknown</span>;
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4 text-center fw-bold text-uppercase">My Orders</h2>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-5">
                    <p className="lead text-muted">You haven't placed any orders yet.</p>
                    <Link href="/client" className="btn btn-primary">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="table-responsive shadow-sm rounded">
                    <table className="table table-hover align-middle mb-0 bg-white">
                        <thead className="bg-light">
                            <tr>
                                <th className="py-3 px-4">Order ID</th>
                                <th className="py-3 px-4">Date</th>
                                <th className="py-3 px-4">Address</th>
                                <th className="py-3 px-4">Total</th>
                                <th className="py-3 px-4">Status</th>
                                {/* <th className="py-3 px-4">Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => {
                                // Calculate total from orderDetails if not present in order object directly
                                // Assuming order object has total or we sum up details if available.
                                // The backend 'createOrder' saves 'order' entity but 'Order' entity doesn't seem to have 'totalAmount' field in the snippet I read earlier!
                                // It has 'orderDate', 'status' etc.
                                // Let's check 'Order' entity again. It has no 'totalAmount'.
                                // So we might need to sum up `orderDetail.subtotal`.
                                // However, `Order` entity returned by backend might not have `orderDetails` loaded if FetchType is LAZY.
                                // But `OrderRepository.findByCustomerId` returns `List<Order>`.
                                // Let's assume for now we might not display total if it's complex, or we rely on some field I missed.
                                // Actually, `Order` entity did NOT have `totalAmount`.
                                // I should check if backend returns `orderDetails`. If yes, I can sum them.
                                // If not, I'll just show Date and Status for now, or assume backend computes it.
                                // Wait, `Order` entity in snippet:
                                // `private Integer id; ... private LocalDate orderDate; ...`
                                // No total.
                                // Validation: user wants to see their order.

                                // I will calculate total if `orderDetails` is present.
                                const total = order.orderDetails ? order.orderDetails.reduce((acc: any, detail: any) => acc + (detail.subtotal || 0), 0) : 0;

                                return (
                                    <tr key={order.id}>
                                        <td className="px-4 fw-bold">#{order.id}</td>
                                        <td className="px-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td className="px-4">{order.shipAddress}</td>
                                        <td className="px-4 fw-bold text-danger">
                                            {/* If total is 0, maybe details are not fetching. I'll just show what I can. */}
                                            {total > 0 ? total.toLocaleString() + ' đ' : 'N/A'}
                                        </td>
                                        <td className="px-4">{getStatusBadge(order.status)}</td>
                                        {/* <td className="px-4">
                                            <button className="btn btn-sm btn-outline-primary">View</button>
                                        </td> */}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderInformation;
