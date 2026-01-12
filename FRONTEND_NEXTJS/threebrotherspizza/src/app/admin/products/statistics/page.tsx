/* trang thống kế báo cáo cho product manage */

'use client';
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import axiosAdmin from '@/axios/axiosAdmin';
import { useToast } from '@/contexts/ToastContext';


interface ProductStatistics {
    activeCount: number;
    inactiveCount: number;
    categoryStats: Array<{ categoryName: string; count: number }>;
    priceRangeStats: Array<{ priceRange: string; count: number }>;
}

export default function ProductStatisticsPage() {
    const [statistics, setStatistics] = useState<ProductStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            const response = await axiosAdmin.get('/products/statistics');
            
            if (response.data.statuscode === 200) {
                setStatistics(response.data.data);
            } else {
                showToast(response.data.msg || 'Failed to load statistics', 'danger');
            }
        } catch (error: any) {
            showToast(error.response?.data?.msg || 'Error loading statistics', 'danger');
        } finally {
            setLoading(false);
        }
    };

    // Option cho biểu đồ tròn - Trạng thái Active/Inactive
    const activeChartOption = {
        title: {
            text: 'Product Status Statistics',
            left: 'center',
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'middle'
        },
        series: [
            {
                name: 'Status',
                type: 'pie',
                radius: '50%',
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    formatter: '{b}: {c}\n({d}%)'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                data: statistics ? [
                    { value: statistics.activeCount, name: 'Active', itemStyle: { color: '#28a745' } },
                    { value: statistics.inactiveCount, name: 'Inactive', itemStyle: { color: '#dc3545' } }
                ] : []
            }
        ]
    };

    // Option cho biểu đồ tròn - Theo Category
    const categoryChartOption = {
        title: {
            text: 'Products by Category',
            left: 'center',
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'middle'
        },
        series: [
            {
                name: 'Category',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    formatter: '{b}: {c}\n({d}%)'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 14,
                        fontWeight: 'bold'
                    }
                },
                data: statistics?.categoryStats.map(item => ({
                    value: item.count,
                    name: item.categoryName
                })) || []
            }
        ]
    };

    // Option cho biểu đồ cột - Theo khoảng giá
    const priceChartOption = {
        title: {
            text: 'Products by Price Range',
            left: 'center',
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: statistics?.priceRangeStats.map(item => item.priceRange) || [],
            axisLabel: {
                rotate: 45
            }
        },
        yAxis: {
            type: 'value',
            name: 'Number of Products'
        },
        series: [
            {
                name: 'Products',
                type: 'bar',
                data: statistics?.priceRangeStats.map(item => item.count) || [],
                itemStyle: {
                    color: '#5470c6'
                },
                label: {
                    show: true,
                    position: 'top'
                }
            }
        ]
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <h1 className="text-center mb-4">Product Statistics Report</h1>
            
            <div className="row mb-4">
                {/* Biểu đồ Trạng thái */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <ReactECharts 
                                option={activeChartOption} 
                                style={{ height: '400px' }}
                                opts={{ renderer: 'svg' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Biểu đồ Category */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <ReactECharts 
                                option={categoryChartOption} 
                                style={{ height: '400px' }}
                                opts={{ renderer: 'svg' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Biểu đồ theo Price Range */}
                <div className="col-md-12 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <ReactECharts 
                                option={priceChartOption} 
                                style={{ height: '400px' }}
                                opts={{ renderer: 'svg' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}