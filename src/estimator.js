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
    0.15 * impact.infectionsByRequestedTime
  );

  severeImpact.severeCasesByRequestedTime = Math.trunc(
    0.15 * severeImpact.infectionsByRequestedTime
  );

  impact.hospitalBedsByRequestedTime = Math.trunc(
    0.35 * data.totalHospitalBeds - impact.severeCasesByRequestedTime
  );

  severeImpact.hospitalBedsByRequestedTime = Math.trunc(
    0.35 * data.totalHospitalBeds - severeImpact.severeCasesByRequestedTime
  );

  impact.casesForICUByRequestedTime = Math.trunc(
    0.05 * impact.infectionsByRequestedTime
  );

  severeImpact.casesForICUByRequestedTime = Math.trunc(
    0.05 * severeImpact.infectionsByRequestedTime
  );

  impact.casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * impact.infectionsByRequestedTime
  );

  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * severeImpact.infectionsByRequestedTime
  );

  impact.dollarsInFlight =Math.trunc(
    (impact.infectionsByRequestedTime *
      data.region.avgDailyIncomeInUSD *
      data.region.avgDailyIncomePopulation) /
    days);

  severeImpact.dollarsInFlight =Math.trunc(
    (severeImpact.infectionsByRequestedTime *
      data.region.avgDailyIncomeInUSD *
      data.region.avgDailyIncomePopulation) /
    days);

  const result = {
    data,
    impact,
    severeImpact
  };
  return result;
};

export default covid19ImpactEstimator;
