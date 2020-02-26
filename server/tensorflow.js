const tf = require("@tensorflow/tfjs");

// const trainX = [
//   3.3,
//   4.4,
//   5.5,
//   6.71,
//   6.93,
//   4.168,
//   9.779,
//   6.182,
//   7.59,
//   2.167,
//   7.042,
//   10.791,
//   5.313,
//   7.997,
//   5.654,
//   9.27,
//   3.1
// ];
// const trainY = [
//   1.7,
//   2.76,
//   2.09,
//   3.19,
//   1.694,
//   1.573,
//   3.366,
//   2.596,
//   2.53,
//   1.221,
//   2.827,
//   3.465,
//   1.65,
//   2.904,
//   2.42,
//   2.94,
//   1.3
// ];

const m = tf.variable(tf.scalar(Math.random()));
const b = tf.variable(tf.scalar(Math.random()));

function predict(x) {
  return tf.tidy(() => {
    return m.mul(x).add(b);
  });
}

// const predictionsBefore = predict(tf.tensor1d(trainX));

function loss(prediction, labels) {
  //subtracts the two arrays & squares each element of the tensor then finds the mean.
  const error = prediction
    .sub(labels)
    .square()
    .mean();
  return error;
}

let a = 0;

module.exports.train = async function train(data) {
  const { trainX, trainY } = data;
  const learningRate = 0.005;
  const optimizer = tf.train.sgd(learningRate);

  optimizer.minimize(function() {
    const predsYs = predict(tf.tensor1d(trainX));
    console.log(predsYs);
    stepLoss = loss(predsYs, tf.tensor1d(trainY));
    console.log(stepLoss.dataSync()[0]);
    return stepLoss;
  });
  const optimzedData = await this.getTFdata(data);
  return optimzedData;
};

module.exports.getTFdata = async function getTFdata(data) {
  const { trainX, trainY } = data;

  const predictionsBefore = predict(tf.tensor1d(trainX));

  let plotData = [];

  for (let i = 0; i < trainY.length; i++) {
    plotData.push({ x: trainX[i], y: trainY[i] });
  }

  let predictedData = await predictionsBefore.data();
  let predictedPoints = [];
  for (let i = 0; i < predictedData.length; i++) {
    predictedPoints.push({ x: trainX[i], y: predictedData[i] });
  }

  a = a + 1;

  console.log("predictedPoints", predictedPoints, " -- counter", a);
  return predictedPoints;
};

// p();
