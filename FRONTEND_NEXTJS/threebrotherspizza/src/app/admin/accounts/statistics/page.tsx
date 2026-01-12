'use client';
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import axiosAdmin from '@/axios/axiosAdmin';
import { useToast } from '@/contexts/ToastContext';

interface UserStatistics {
    maleCount: number;
    femaleCount: number;
    activeCount: number;
    inactiveCount: number;
    monthlyStats: Array<{ month: number; count: number }>;
    yearlyStats: Array<{ year: number; count: number }>;
}

export default function UserStatisticsPage() {
    const [statistics, setStatistics] = useState<UserStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            const response = await axiosAdmin.get('/users/statistics');
            
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

    // Option cho biểu đồ tròn - Giới tính
    const genderChartOption = {
        title: {
            text: 'Statistics by Gender',
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
                name: 'Gender',
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
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                data: statistics ? [
                    { value: statistics.maleCount, name: 'Male' },
                    { value: statistics.femaleCount, name: 'Female' }
                ] : []
            }
        ]
    };

    // Option cho biểu đồ tròn - Trạng thái Active
    const activeChartOption = {
        title: {
            text: 'Statistics by Status',
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

    // Option cho biểu đồ cột - Đăng ký theo tháng
    const monthlyChartOption = {
        title: {
            text: 'User Registrations by Month (Current Year)',
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
            data: statistics?.monthlyStats.map(item => `Month ${item.month}`) || [],
            axisLabel: {
                rotate: 45
            }
        },
        yAxis: {
            type: 'value',
            name: 'Quantity'
        },
        series: [
            {
                name: 'Users',
                type: 'bar',
                data: statistics?.monthlyStats.map(item => item.count) || [],
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

    // Option cho biểu đồ cột - Đăng ký theo năm
    const yearlyChartOption = {
        title: {
            text: 'User Registrations by Year',
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
            data: statistics?.yearlyStats.map(item => `Year ${item.year}`) || []
        },
        yAxis: {
            type: 'value',
            name: 'Quantity'
        },
        series: [
            {
                name: 'Users',
                type: 'bar',
                data: statistics?.yearlyStats.map(item => item.count) || [],
                itemStyle: {
                    color: '#91cc75'
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
            <h1 className="text-center mb-4">User Statistics Report</h1>
            
            <div className="row mb-4">
                {/* Biểu đồ Giới tính */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <ReactECharts 
                                option={genderChartOption} 
                                style={{ height: '400px' }}
                                opts={{ renderer: 'svg' }}
                            />
                        </div>
                    </div>
                </div>

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
            </div>

            <div className="row">
                {/* Biểu đồ theo Tháng */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <ReactECharts 
                                option={monthlyChartOption} 
                                style={{ height: '400px' }}
                                opts={{ renderer: 'svg' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Biểu đồ theo Năm */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <ReactECharts 
                                option={yearlyChartOption} 
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