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
