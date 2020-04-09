const normalize = (data) => {
  if (data.periodType === 'days') {
    return data.timeToElapse;
  }
  if (data.periodType === 'weeks') {
    return data.timeToElapse * 7;
  }
  if (data.periodType === 'months') {
    return data.timeToElapse * 30;
  }
  return 0;
};

const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};
  const days = normalize(data);
  const Tp = Math.trunc(days / 3);
  impact.currentlyInfected = data.reportedCases * 10;
  severeImpact.currentlyInfected = data.reportedCases * 50;

  impact.infectionsByRequestedTime = impact.currentlyInfected * 2 ** Tp;
  severeImpact.infectionsByRequestedTime =
    severeImpact.currentlyInfected * 2 ** Tp;

  impact.severeCasesByRequestedTime = Math.trunc(
    (15 / 100) * impact.infectionsByRequestedTime
  );
  severeImpact.severeCasesByRequestedTime = Math.trunc(
    (15 / 100) * severeImpact.infectionsByRequestedTime
  );

  impact.hospitalBedsByRequestedTime = Math.trunc(
    (35 / 100) * data.totalHospitalBeds
  )-impact.severeCasesByRequestedTime;
  severeImpact.hospitalBedsByRequestedTime = Math.trunc(
    (35 / 100) * data.totalHospitalBeds
  )-severeImpact.severeCasesByRequestedTime;

  impact.casesForICUByRequestedTime = Math.trunc(
    (5 / 100) * impact.infectionsByRequestedTime
  );
  impact.casesForVentilatorsByRequestedTime = Math.trunc(
    (2 / 100) * impact.infectionsByRequestedTime
  );

  severeImpact.casesForICUByRequestedTime = Math.trunc(
    (5 / 100) * severeImpact.infectionsByRequestedTime
  );
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    (2 / 100) * severeImpact.infectionsByRequestedTime
  );

  impact.dollarsInFlight = (
    impact.infectionsByRequestedTime *
    data.region.avgDailyIncomeInUSD *
    data.region.avgDailyIncomePopulation *
    30
  ).toFixed(2);

  severeImpact.dollarsInFlight = (
    severeImpact.infectionsByRequestedTime *
    data.region.avgDailyIncomeInUSD *
    data.region.avgDailyIncomePopulation *
    30
  ).toFixed(2);
  const result = {
    data,
    impact,
    severeImpact
  };
  return result;
};

export default covid19ImpactEstimator;
