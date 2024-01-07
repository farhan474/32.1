

const express = require("express");
const app = express();
const fs = require("fs");
const filePath = process.cwd()+'/result.json';

app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

// Define the routes for mean, median, and mode
app.get("/mean", (req, res) => {
    const nums = req.query.nums;

    if (!nums) {
        return res.status(400).json({ error: "nums are required" });
    }

    const numbers = nums.split(",").map(Number);

    if (numbers.some(isNaN)) {
        return res.status(400).json({ error: "Invalid number provided" });
    }

    let result = { operation: "mean", value: calculateMean(numbers) };
    res.json(result);
    result.timestamp = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(result, null,2))

});

app.get("/median", (req, res) => {
    const nums = req.query.nums;

    if (!nums) {
        return res.status(400).json({ error: "nums are required" });
    }

    const numbers = nums.split(",").map(Number);

    if (numbers.some(isNaN)) {
        return res.status(400).json({ error: "Invalid number provided" });
    }

    const result = { operation: "medium", value: calculateMedian(numbers) };
    res.json(result);
    result.timestamp = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(result, null,2))
});

app.get("/mode", (req, res) => {
    const nums = req.query.nums;

    if (!nums) {
        return res.status(400).json({ error: "nums are required" });
    }

    const numbers = nums.split(",").map(Number);

    if (numbers.some(isNaN)) {
        return res.status(400).json({ error: "Invalid number provided" });
    }

    const result = { operation: "mode", value: calculateMode(numbers) };
    res.json(result);
    result.timestamp = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(result, null,2))
});


app.get("/all", (req, res) => {
    const nums = req.query.nums;

    if (!nums) {
        return res.status(400).json({error: "nums are required"});
    }

    const numbers = nums.split(",").map(Number);

    if (numbers.some(isNaN)) {
        return res.status(400).json({error: "Invalid number provided"});
    }

    const mean = calculateMean(numbers);
    const median = calculateMedian(numbers);
    const mode = calculateMode(numbers);
    const timestamp = new Date().toISOString();

    const result = {
        operation: "all",
        mean: mean,
        median: median,
        mode: mode,
        timestamp: timestamp,
    };
    res.json(result);
    result.timestamp = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(result, null,2))
});
// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Helper functions for statistical operations
function calculateMean(numbers) {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}

function calculateMedian(numbers) {
    const sortedNumbers = numbers.sort((a, b) => a - b);
    const middle = Math.floor(sortedNumbers.length / 2);
    if (sortedNumbers.length % 2 === 0) {
        return (sortedNumbers[middle - 1] + sortedNumbers[middle]) / 2;
    } else {
        return sortedNumbers[middle];
    }
}

function calculateMode(numbers) {
    const numCounts = {};
    let maxCount = 0;
    let mode = null;

    for (const num of numbers) {
        if (!numCounts[num]) {
            numCounts[num] = 1;
        } else {
            numCounts[num]++;
        }

        if (numCounts[num] > maxCount) {
            maxCount = numCounts[num];
            mode = num;
        }
    }

    return mode;
}
