import React, { useEffect, useState } from 'react';
import { DistributionType, getVariantDistributionData } from '../services/api';

// See https://github.com/plotly/react-plotly.js/issues/135#issuecomment-500399098
import createPlotlyComponent from 'react-plotly.js/factory';
import { DataDistributionConfiguration } from '../helpers/types';
import { AgeDistributionEntry } from '../services/api-types';

const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

interface Props {
  data: DataDistributionConfiguration;
}

export const VariantAgeDistributionPlot = ({ data }: Props) => {
  const [distributionData, setDistributionData] = useState<AgeDistributionEntry[] | undefined>(undefined);

  useEffect(() => {
    let isSubscribed = true;
    const controller = new AbortController();
    const signal = controller.signal;
    getVariantDistributionData(
      DistributionType.Age,
      data.country,
      data.mutations,
      data.matchPercentage,
      signal
    )
      .then(newDistributionData => {
        if (isSubscribed) {
          console.log('AGE SET', newDistributionData);
          setDistributionData(newDistributionData);
        } else {
          console.log('AGE NOT SET');
        }
      })
      .catch(e => {
        console.log('Called fetch data error', e);
      });
    return () => {
      isSubscribed = false;
      controller.abort();
      console.log('AGE Cleanup render for variant age distribution plot');
    };
  }, [data]);

  return (
    <div style={{ height: '100%' }}>
      {distributionData !== undefined && (
        <Plot
          style={{ width: '100%', height: '100%' }}
          data={[
            {
              name: 'Sequences',
              type: 'bar',
              x: distributionData.map(d => d.x),
              y: distributionData.map(d => d.y.count),
            },
            {
              x: distributionData.map(d => d.x),
              y: distributionData.map(d => d.y.proportion.value * 100),
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: 'red' },
              yaxis: 'y2',
              hovertemplate: '%{y:.2f}%<extra></extra>',
            },
          ]}
          layout={{
            title: 'Age Distribution',
            xaxis: {
              title: 'Age',
            },
            yaxis: {
              title: 'Number Sequences',
            },
            yaxis2: {
              title: 'Estimated Percentage',
              overlaying: 'y',
              side: 'right',
            },
            showlegend: false,
          }}
          config={{
            displaylogo: false,
            modeBarButtons: [['zoom2d', 'toImage', 'resetScale2d', 'pan2d']],
            responsive: true,
          }}
        />
      )}
    </div>
  );
};