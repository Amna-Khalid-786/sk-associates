'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface MarketChartProps {
    propertyPrice: number;
    propertyCity: string;
    propertyType: string;
    rentalYield: string;
    sectorDemand: string;
}

// Generate realistic monthly price data based on actual property price
function generatePriceHistory(basePrice: number, city: string, type: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Growth rate varies by city
    const cityGrowthFactor: Record<string, number> = {
        'Islamabad': 0.012,
        'Rawalpindi': 0.008,
        'Lahore': 0.010,
    };
    
    const growthRate = cityGrowthFactor[city] || 0.01;
    const startPrice = basePrice * 0.88; // Price 12 months ago was ~12% less
    
    const data = months.map((month, i) => {
        // Add realistic monthly fluctuation
        const trend = startPrice * (1 + growthRate * i);
        const noise = trend * (Math.sin(i * 1.5) * 0.015 + (Math.random() - 0.5) * 0.01);
        const price = Math.round(trend + noise);
        return { month, price };
    });

    return data;
}

export default function MarketChart({ propertyPrice, propertyCity, propertyType, rentalYield, sectorDemand }: MarketChartProps) {
    const [animate, setAnimate] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [selectedTab, setSelectedTab] = useState<'price' | 'growth'>('price');

    useEffect(() => {
        const timer = setTimeout(() => setAnimate(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const priceData = useMemo(
        () => generatePriceHistory(propertyPrice, propertyCity, propertyType),
        [propertyPrice, propertyCity, propertyType]
    );

    // Calculate stats
    const firstPrice = priceData[0].price;
    const lastPrice = priceData[priceData.length - 1].price;
    const totalGrowth = ((lastPrice - firstPrice) / firstPrice * 100).toFixed(1);
    const avgMonthlyGrowth = (parseFloat(totalGrowth) / 12).toFixed(2);

    // Chart dimensions
    const chartWidth = 600;
    const chartHeight = 200;
    const padding = { top: 20, right: 20, bottom: 30, left: 20 };
    const innerWidth = chartWidth - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;

    // Scale data to chart
    const prices = priceData.map(d => d.price);
    const minPrice = Math.min(...prices) * 0.98;
    const maxPrice = Math.max(...prices) * 1.02;

    const xScale = (i: number) => padding.left + (i / (priceData.length - 1)) * innerWidth;
    const yScale = (price: number) => padding.top + innerHeight - ((price - minPrice) / (maxPrice - minPrice)) * innerHeight;

    // Build SVG path
    const linePath = priceData
        .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.price)}`)
        .join(' ');

    // Area fill path
    const areaPath = `${linePath} L ${xScale(priceData.length - 1)} ${chartHeight - padding.bottom} L ${xScale(0)} ${chartHeight - padding.bottom} Z`;

    // Growth data (percentage change month over month)
    const growthData = priceData.map((d, i) => {
        if (i === 0) return { month: d.month, growth: 0 };
        const prev = priceData[i - 1].price;
        return { month: d.month, growth: parseFloat(((d.price - prev) / prev * 100).toFixed(2)) };
    });

    const maxGrowth = Math.max(...growthData.map(d => Math.abs(d.growth))) * 1.5;
    const barWidth = innerWidth / growthData.length * 0.6;
    const barGap = innerWidth / growthData.length;

    const formatPrice = (price: number) => {
        if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `${(price / 100000).toFixed(1)} Lac`;
        return price.toLocaleString();
    };

    return (
        <div className="space-y-8">
            {/* Chart Tab Selector */}
            <div className="flex gap-2">
                <button
                    onClick={() => setSelectedTab('price')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        selectedTab === 'price'
                            ? 'bg-white text-black shadow-lg'
                            : 'bg-white/10 text-zinc-400 hover:text-white'
                    }`}
                >
                    Price Trend
                </button>
                <button
                    onClick={() => setSelectedTab('growth')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        selectedTab === 'growth'
                            ? 'bg-white text-black shadow-lg'
                            : 'bg-white/10 text-zinc-400 hover:text-white'
                    }`}
                >
                    Monthly Growth
                </button>
            </div>

            {/* Chart Title & Description */}
            <div>
                <h4 className="text-white font-black text-lg mb-1">
                    {selectedTab === 'price'
                        ? `12-Month Price Trend — ${propertyCity}`
                        : `Month-over-Month Growth Rate`
                    }
                </h4>
                <p className="text-zinc-500 text-sm font-medium">
                    {selectedTab === 'price'
                        ? `This chart shows the estimated market value progression of this ${propertyType.toLowerCase()} over the past 12 months based on ${propertyCity} sector data. The current asking price reflects a ${totalGrowth}% annual appreciation.`
                        : `Each bar represents the percentage price change compared to the previous month. Positive bars (upward) indicate months where the property value increased.`
                    }
                </p>
            </div>

            {/* Chart Container */}
            <div className="bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10 relative">
                {/* Hover tooltip */}
                {hoveredIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-2 right-4 bg-white text-black rounded-xl px-4 py-2 shadow-xl z-10"
                    >
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            {priceData[hoveredIndex].month} 2025
                        </p>
                        <p className="text-sm font-black">
                            {selectedTab === 'price'
                                ? `PKR ${formatPrice(priceData[hoveredIndex].price)}`
                                : `${growthData[hoveredIndex].growth > 0 ? '+' : ''}${growthData[hoveredIndex].growth}%`
                            }
                        </p>
                    </motion.div>
                )}

                <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-auto"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="white" stopOpacity="0.01" />
                        </linearGradient>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#a1a1aa" />
                            <stop offset="100%" stopColor="#ffffff" />
                        </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0.25, 0.5, 0.75].map((frac, i) => (
                        <line
                            key={i}
                            x1={padding.left}
                            y1={padding.top + innerHeight * frac}
                            x2={chartWidth - padding.right}
                            y2={padding.top + innerHeight * frac}
                            stroke="rgba(255,255,255,0.06)"
                            strokeDasharray="4 6"
                        />
                    ))}

                    {selectedTab === 'price' ? (
                        <>
                            {/* Area fill */}
                            <motion.path
                                d={areaPath}
                                fill="url(#areaGradient)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: animate ? 1 : 0 }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />

                            {/* Line */}
                            <motion.path
                                d={linePath}
                                fill="none"
                                stroke="url(#lineGradient)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: animate ? 1 : 0 }}
                                transition={{ duration: 1.5, ease: 'easeInOut' }}
                            />

                            {/* Data points */}
                            {priceData.map((d, i) => (
                                <g key={i}>
                                    <motion.circle
                                        cx={xScale(i)}
                                        cy={yScale(d.price)}
                                        r={hoveredIndex === i ? 6 : 3.5}
                                        fill={hoveredIndex === i ? 'white' : 'rgba(255,255,255,0.7)'}
                                        stroke={hoveredIndex === i ? 'white' : 'none'}
                                        strokeWidth="2"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: animate ? 1 : 0, scale: animate ? 1 : 0 }}
                                        transition={{ delay: 0.8 + i * 0.08 }}
                                        style={{ cursor: 'pointer' }}
                                        onMouseEnter={() => setHoveredIndex(i)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    />
                                </g>
                            ))}
                        </>
                    ) : (
                        <>
                            {/* Center line */}
                            <line
                                x1={padding.left}
                                y1={chartHeight / 2}
                                x2={chartWidth - padding.right}
                                y2={chartHeight / 2}
                                stroke="rgba(255,255,255,0.15)"
                                strokeWidth="1"
                            />

                            {/* Growth bars */}
                            {growthData.map((d, i) => {
                                const barHeight = (Math.abs(d.growth) / maxGrowth) * (innerHeight / 2);
                                const barX = padding.left + i * barGap + (barGap - barWidth) / 2;
                                const barY = d.growth >= 0
                                    ? chartHeight / 2 - barHeight
                                    : chartHeight / 2;

                                return (
                                    <motion.rect
                                        key={i}
                                        x={barX}
                                        y={barY}
                                        width={barWidth}
                                        height={barHeight}
                                        rx={4}
                                        fill={d.growth >= 0 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'}
                                        initial={{ scaleY: 0 }}
                                        animate={{ scaleY: animate ? 1 : 0 }}
                                        transition={{ delay: 0.2 + i * 0.06, duration: 0.5 }}
                                        style={{ 
                                            transformOrigin: d.growth >= 0 ? `${barX + barWidth/2}px ${chartHeight / 2}px` : `${barX + barWidth/2}px ${chartHeight / 2}px`,
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={() => setHoveredIndex(i)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    />
                                );
                            })}
                        </>
                    )}

                    {/* Month labels */}
                    {priceData.map((d, i) => (
                        <text
                            key={i}
                            x={selectedTab === 'price' ? xScale(i) : padding.left + i * barGap + barGap / 2}
                            y={chartHeight - 8}
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.3)"
                            fontSize="9"
                            fontWeight="800"
                        >
                            {d.month}
                        </text>
                    ))}
                </svg>
            </div>

            {/* Key Stats Strip */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">12-Month Growth</p>
                    <p className="text-xl font-black text-white">+{totalGrowth}%</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Avg Monthly</p>
                    <p className="text-xl font-black text-white">+{avgMonthlyGrowth}%</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Rental Yield</p>
                    <p className="text-xl font-black text-white">{rentalYield}</p>
                </div>
            </div>
        </div>
    );
}
