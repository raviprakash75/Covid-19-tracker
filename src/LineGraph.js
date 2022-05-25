import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
// import {Legend,Tooltips,} from 'chart.js';
import numeral from 'numeral';
const options = {
    Legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        }
    },
    maintainAspectRatio: false,
    Tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function (tooltipsItem, data) {
                return numeral(tooltipsItem.value).format("+0,0");
            }
        }
    },
    scales: {
        xAxes: [{
            type: 'time',
            time: {
                format: 'MM/DD/YY',
                tooltipFormat: 'll'
            }
        }],
        yAxes: [{
            gridLines: {
                display: false,
            },
            ticks: {
                callback: function (value, index, values) {
                    return numeral(value).format('0a');
                }
            }
        }]
    }
}
const buildChartData = (data, casesType) => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data[casesType]){
        if(lastDataPoint) {
            let newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint,
            };
            chartData.push(newDataPoint);
        }
        lastDataPoint=data[casesType][date];
    }
    return chartData;
}
function LineGraph({casesType}) {
    const [data, setData] = useState({});
    //https://disease.sh/v3/covid-19/historical/all?lastdays=120
   
    useEffect(() => {
        const fetchData=async()=>{
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then((response) =>{ return response.json()})
            .then(data => {
                console.log(data);
                let chartData = buildChartData(data,casesType);
                setData(chartData);
            })
        }
       fetchData();
    }, [casesType]);
    return (
        <div>
            <h2>i am a graph</h2>
            {data?.length>0 &&(
              <Line
                data={{
                    datasets: [{
                        data: data,
                        backgroundColor: "rgba(204,16,2,0.5)",
                        borderColor: "#CC1034"
                    }]
                }}
                options={options}
               />
            )}
           
        </div>
    )
}

export default LineGraph
