// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";
// import cloud from "d3-cloud";

// // Create a seeded random generator
// const seededRandom = (seed) => {
//   let x = Math.sin(seed++) * 10000;
//   return x - Math.floor(x);
// };

// const WordCloud = ({ data }) => {
//   const cloudRef = useRef();
//   let margin = { top: 10, right: 10, bottom: 10, left: 10 };

//   useEffect(() => {
//     const width = 600;
//     const height = 400;
//     // set the dimensions and margins of the graph

//     const words = Object.entries(data)
//       .sort(([a], [b]) => a.localeCompare(b)) // Alphabetical order
//       .map(([text, size], index) => ({
//         text,
//         size: Math.sqrt(size) * 45, // Font size scaling
//         colorIndex: index % 10, // Assign a color index
//         seed: index, // Use index as seed for fixed position
//       }));

//     const layout = cloud()
//       .size([width, height])
//       .words(words)
//       .padding(5)
//       .rotate(() => 0) // No rotation for consistency
//       .fontSize((d) => d.size)
//       .random(() => seededRandom(42)) // Use a fixed seed
//       .padding(10) //space between words

//       .on("end", draw);

//     layout.start();

//     function draw(words) {
//       const svg = d3
//         .select(cloudRef.current)
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom);

//       svg.selectAll("*").remove(); // Clear previous render

//       svg
//         .append("g")
//         .attr("transform", `translate(${width / 2}, ${height / 2})`)
//         .selectAll("text")
//         .data(words)
//         .enter()
//         .append("text")
//         .style("font-size", (d) => `${d.size}px`)
//         .style("font-family", "Impact")

//         .style("fill", (d) => d3.schemeCategory10[d.colorIndex]) // Fixed color scheme
//         .attr("text-anchor", "middle")
//         .attr("transform", (d) => `translate(${d.x},${d.y})`)
//         .text((d) => d.text);
//     }
//   }, [data]);

//   return <svg ref={cloudRef}></svg>;
// };

// export default WordCloud;

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

const WordCloud = ({ data }) => {
  const cloudRef = useRef();

  useEffect(() => {
    const width = 600;
    const height = 400;

    const words = Object.entries(data)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([text, size], index) => ({
        text,
        size: Math.sqrt(size) * 35,
        colorIndex: index % 10,
        seed: index,
      }));

    const layout = cloud()
      .size([width, height])
      .words(words)
      .padding(10)
      .rotate(() => 0)
      .fontSize((d) => d.size)
      .random(() => 0.5) // Fixed randomness
      .on("end", draw);

    layout.start();

    function draw(words) {
      const svg = d3
        .select(cloudRef.current)
        .attr("width", width)
        .attr("height", height);

      svg.selectAll("*").remove();

      svg
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`)
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d) => `${d.size}px`)
        .style("fill", (d) => d3.schemeCategory10[d.colorIndex])
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .style("font-family", "Impact")
        .text((d) => d.text);
    }
  }, [data]);

  return <svg ref={cloudRef}></svg>;
};

export default WordCloud;
