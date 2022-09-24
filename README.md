# React Cloud

Cloud generator bindings for React. See [@alesmenzel/cloud](https://www.npmjs.com/package/@alesmenzel/cloud) if you want to create bindings for a different UI library.

## Installation

```bash
npm install @alesmenzel/cloud-react
```

### Usage

Example of how to use wordcloud generator with React.

```tsx
import React from 'react'
import { useMemo, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { faker } from '@faker-js/faker';
import {
  ArchimedeanRandomRandomizer,
  WordCollider,
  HearthWordColliderMask,
  random,
  useResizeObserver,
  useCloud,
} from '@alesmenzel/cloud-react';

export type Word = { text: string; count: number };

const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 50;
const FONT = 'Roboto';
const RANDOMIZER = new ArchimedeanRandomRandomizer<Word>({ width: 100, height: 100 });
const COLLIDER = new WordCollider<Word>({
  width: 100,
  height: 100,
  font: FONT,
  textAlign: 'center',
  textBaseline: 'middle',
  mask: new HearthWordColliderMask(),
  gap: 2,
});

// Color words based on their size
const colorScale = scaleLinear<string, string>()
  .domain([MIN_FONT_SIZE, MAX_FONT_SIZE])
  .range(['pink', 'darkred'])
  .clamp(true);

export function MyCloud() {
  // List of words from some storage, e.g. from API
  const [words] = useState<Word[]>(
    Array.from({ length: 200 }).map((_) => ({
      text: faker.word.adjective(),
      count: random(1, 1000),
    }))
  );

  // Responsive width/height
  const { ref, width, height } = useResizeObserver<HTMLDivElement>();

  // Scale word count to font size
  const fontScale = useMemo(() => {
    const max = words.reduce((acc, word) => Math.max(acc, word.count), 0);
    // Could use also scaleLog instead to make the smaller words bigger
    return scaleLinear().domain([1, max]).range([MIN_FONT_SIZE, MAX_FONT_SIZE]).clamp(true);
  }, [words]);

  // Set initial width/height and options
  const { points } = useCloud<Word>({
    width,
    height,
    randomizer: RANDOMIZER,
    collider: COLLIDER,
    attempts: 200,
    items: words,
    transform: (item) => {
      return { ...item, count: fontScale(item.count) };
    },
  });

  // render the cloud with canvas/svg/html as you like
  return (
    <div className="resizer" ref={ref}>
      <svg width="100%" height="100%">
        {points.map((point) => {
          const { x, y, item, index } = point;
          return (
            // Must be wrapped in a group, otherwise the hover animation use svg origin
            <g transform={`translate(${x} ${y})`} key={index}>
              {/* The text style must match the style used in Cloud otherwise the collision detection
             will not work correctly */}
              <text
                x={0}
                y={0}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill={colorScale(item.count)}
                className="word"
                style={{
                  font: `${item.count}px ${FONT}`,
                }}
              >
                {item.text}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

```
