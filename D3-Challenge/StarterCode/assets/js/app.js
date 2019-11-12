d3.select(window).on('resize', makeResponsive);

makeResponsive();

function makeResponsive() {
    var svgArea = d3.select('body').select('svg');
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    var svgW = window.innerWidth;
    var svgH = window.innerHeight;

    var margin = { top: 20, right: 150, bottom: 100, left: 130 };

    var w = svgW - margin.left - margin.right;
    var h = svgH - margin.top - margin.bottom;

    
    var svg = d3
        .select('.chart')
        .append('svg')
        .attr('height', svgH)
        .attr('width', svgW)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var Chrt = svg.append("g");

    d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

    d3.csv("data/data.csv", function(err, six_five_data) {
    if (err) throw err;
    
    six_five_data.forEach(function(data) {
        data.allTeethRemoved = +data.allTeethRemoved;
        data.bachelorOrHigher = +data.bachelorOrHigher;
        data.white = +data.white;
        data.skinCancer = +data.skinCancer;
        data.foodStamp = +data.foodStamp;
        data.smoke = +data.smoke;
    });


    var yLS = d3.scaleLinear().range([h, 0]);
    var xLS = d3.scaleLinear().range([0, w]);

    var bAxis = d3.axisBottom(xLS;
    var lAxis = d3.axisLeft(yLS);

    var xMin;
    var xMax;
    var yMin;
    var yMax;

    function findMinAndMax(dataColumnX, dataColumnY) {
        xMin = d3.min(six_five_data, function(data) {
        return +data[dataColumnX] * 0.8;
        });

        xMax = d3.max(six_five_data, function(data) {
        return +data[dataColumnX] * 1.1;
        });

        yMin = d3.min(six_five_data, function(data) {
        return +data[dataColumnY] * 0.8;
        });

        yMax = d3.max(six_five_data, function(data) {
        return +data[dataColumnY] * 1.1;
        });
    }

    var cLX = "BachelorDegreeOrAbove";
    var cLY = "NoTeeth";
    
    findMinAndMax(cLX, cLY);

    xLS.domain([xMin, xMax]);
    yLS.domain([yMin, yMax]);

    var toolTip = d3
        .tip()
        .attr("class", "d3-tip")
        .offset([0, 0])
        .html(function(data) {
        var states = data.geography;
        var vX = +data[cLX];
        var vY = +data[cLY];
        var sX;
        var sY;
        
        if (cLX === "BachelorDegreeOrAbove") {
            sX = "Bachelor Degree: ";
            sY = "Missing Teeth: ";
        }
        else if (cLX === "Caucasion") {
            sX = "Caucasion: ";
            sY = "Occurances of Skin Cancer: ";
        }
        else {
            sX = "Living off Food Stamps: "
            sY = "Smokes: ";
        }
        return states +
            "<br>" +
            sX +
            vX +
            "<br>" +
            sY +
            vY;
        });
        
    Chrt.call(toolTip);
    
    Chrt
        .selectAll("circle")
        .data(six_five_data)
        .enter()
        .append("circle")
        .attr("cx", function(data, index) {
        return xLS(+data[cLX]);
        })
        .attr("cy", function(data, index) {
        return yLS(+data[cLY]);
        })
        .attr("r", "18")
        .attr("fill", "lightblue")
        .attr("class", "circle")
        
        .on('mouseover', toolTip.show)
        .on('mouseout', toolTip.hide);
    
    Chrt
        .selectAll("text")
        .data(six_five_data)
        .enter()
        .append("text")
        .attr("x", function(data, index) {
          return xLS(+data[cLX]);
        })
        .attr("y", function(data, index) {
          return yLS(+data[cLY]);
        })
        .attr("dx", "-0.65em")
        .attr("dy", "0.4em")
        .style("font-size", "13px")
        .style("fill", "white")
        .attr("class", "abbr")
        .text(function(data, index) {
          return data.abbr;
        });

    Chrt
        .append("g")
        .attr("transform", "translate(0," + h + ")")
        .attr("class", "x-axis")
        .call(bAxis);

    Chrt
        .append("g")
        .attr("class", "y-axis")
        .call(lAxis);

    Chrt
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 80)
        .attr("x", 0 - h / 2)
        .attr("dy", "1em")
        .attr("class", "axis-text change")
        .attr("data-axis-name", "allTeethRemoved")
        .attr("id", "allTeethRemoved")
        .text("65+ with All Teeth Removed (%)");

    Chrt
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 55)
        .attr("x", 0 - h / 2)
        .attr("dy", "1em")
        .attr("class", "axis-text unchange")
        .attr("data-axis-name", "skinCancer")
        .attr("id", "skinCancer")
        .text("% of People Who Had Skin Cancer");

    Chrt
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 30)
        .attr("x", 0 - h / 2)
        .attr("dy", "1em")
        .attr("class", "axis-text unchange")
        .attr("data-axis-name", "smokes")
        .attr("id", "smokes")
        .text("% of Smokers");

    Chrt
        .append("text")
        .attr(
        "transform",
        "translate(" + w / 2 + " ," + (h + margin.top + 20) + ")"
        )
        .attr("class", "axis-text active")
        .attr("data-axis-name", "BachelorDegreeOrAbove")
        .text("% of Bachelor or Above");

    Chrt
        .append("text")
        .attr(
        "transform",
        "translate(" + w / 2 + " ," + (h + margin.top + 45) + ")"
        )
        .attr("class", "axis-text inactive")
        .attr("data-axis-name", "white")
        .text("Race: White (%)");

    Chrt
        .append("text")
        .attr(
        "transform",
        "translate(" + w / 2 + " ," + (h + margin.top + 70) + ")"
        )
        .attr("class", "axis-text inactive")
        .attr("data-axis-name", "foodStamp")
        .text("Family gets food stamps (%)");

    function labelChange(clickedAxis, corrAxis) {
        d3
        .selectAll(".axis-text")
        .filter(".active")
        .classed("active", false)
        .classed("inactive", true);

        d3
        .selectAll(".axis-text")
        .filter(".change")
        .classed("change", false)
        .classed("unchange", true);

        clickedAxis.classed("inactive", false).classed("active", true);
        corrAxis.classed("unchange", false).classed("change", true);
    }

    d3.selectAll(".axis-text").on("click", function() {
    
        var clickedS = d3.select(this);

        var Inactiveclicked = clickedS.classed("inactive");

        var clickedAxis = clickedS.attr("data-axis-name");
        
        var corrAxis;

        if (clickedAxis === "bachelorOrHigher") {
            corrAxis = d3.select("#allTeethRemoved");
        }
        else if (clickedAxis === "white") {
            corrAxis = d3.select("#skinCancer");
        }
        else {
            corrAxis = d3.select("#smoke");
        }

        if (Inactiveclicked) {
        cLX = clickedAxis;
        cLY = corrAxis.attr("data-axis-name");
        findMinAndMax(cLX, cLY);
        xLS.domain([xMin, xMax]);
        yLS.domain([yMin, yMax]);

        svg
            .select(".x-axis")
            .transition()
            .duration(1800)
            .call(bAxis);

        svg
            .select(".y-axis")
            .transition()
            .duration(1800)
            .call(lAxis);

        d3.selectAll("circle").each(function() {
            d3
            .select(this)
            .transition()
            .attr("cx", function(data) {
                return xLS(+data[cLX]);
            })
            .attr("cy", function(data, index) {
                return yLS(+data[cLY]);
            })
            .duration(1800);
        });

        d3.selectAll(".abbr").each(function() {
            d3
            .select(this)
            .transition()
            .attr("x", function(data) {
                return xLS(+data[cLX]);
            })
            .attr("y", function(data, index) {
                return yLS(+data[cLY]);
            })
            .duration(1800);
        });
        labelChange(clickedS, corrAxis);
        }
    });
    });
}