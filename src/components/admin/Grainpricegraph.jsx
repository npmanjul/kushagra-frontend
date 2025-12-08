"use client";
import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const Grainpricegraph = ({maxprice,avgprice,minprice,date,categories}) => {
  const chartRef = useRef(null);

  console.log(avgprice);
  console.log(maxprice);
  console.log(minprice);

  useEffect(() => {
    const options = {
      series: [
        {
          name: "Avg Price",
          data: avgprice,
        },
        {
          name: "Max Price",
          data: maxprice,
        },
        {
          name: "Min Price",
          data: minprice,
        },
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [5, 7, 5],
        curve: "straight",
        dashArray: [0, 8, 5],
      },
      title: {
        text: "",
        align: "left",
        style: {
          fontSize: "20px",
          fontWeight: "bold",
          color: "#333",
        },
      },
      legend: {
        tooltipHoverFormatter: function (val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6,
        },
      },
      xaxis: {
        categories: date,
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val + "";
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val + "";
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val;
              },
            },
          },
        ],
      },
      grid: {
        borderColor: "#f1f1f1",
      },
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    // Cleanup on unmount
    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div className="bg-white ">
      <div id="chart" ref={chartRef}></div>
    </div>
  );
};

export default Grainpricegraph;