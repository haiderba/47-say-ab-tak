/**
 * Centralized Live Rates & Market Benchmarks for Pakistan (2025–2026)
 * Accurate government schedules & Karachi / Lahore market benchmarks.
 */

export interface LiveRatesData {
  gold: {
    k24Tola: number;
    k22Tola: number;
    k21Tola: number;
    k18Tola: number;
    silverTola: number;
    silverGram: number;
  };
  fuel: {
    petrol: number;
    diesel: number;
    lpgKg: number;
    cngKg: number;
  };
  construction: {
    cementBag50kg: number;
    steelGrade60Kg: number;
    steelGrade60Ton: number;
    redBricks1000: number;
    sandRavi100cft: number;
    sandChenab100cft: number;
    crushMargalla100cft: number;
    crushSargodha100cft: number;
    laborGreySqft: number;
    laborFinishingSqft: number;
    greyStructureSqft: number;
    turnkeyFinishingSqft: number;
  };
  solar: {
    panelWattAvg: number; // N-Type TopCon / Mono PERC (PKR / Watt)
    inverterOnGridWattAvg: number; // PKR / Watt
    inverterHybridWattAvg: number; // PKR / Watt
    netMeteringFeeEst: number; // 3-phase green meter DISCO process fee
    genUnitsPerKwMonthly: number; // ~120 to 140 units / kW / month in Pakistan
  };
  currency: {
    usd: number;
    sar: number;
    aed: number;
    gbp: number;
    eur: number;
  };
  nepraTariff: {
    protected: {
      slab1to100: number;
      slab101to200: number;
    };
    unprotected: {
      slab1to100: number;
      slab101to200: number;
      slab201to300: number;
      slab301to700: number;
      slab700plus: number;
    };
    fpaEstimatedPerUnit: number;
    electricityDutyPct: number;
    generalSalesTaxPct: number;
    tvFee: number;
    nonFilerTaxThreshold: number; // Rs 25,000 bill
    nonFilerTaxPct: number; // 7.5% under Section 235A
  };
  gasSngpl: {
    protectedSlabs: { maxHm3: number; ratePerHm3: number; fixedCharge: number }[];
    unprotectedSlabs: { maxHm3: number; ratePerHm3: number; fixedCharge: number }[];
    meterRent: number;
  };
  motorwayTolls: {
    route: string;
    name: string;
    fromTo: string;
    carToll: number;
    wagonToll: number;
    coasterToll: number;
    busToll: number;
    truck2Axle: number;
  }[];
  ptaTaxSlabs: {
    brand: string;
    model: string;
    usdCfValue: number;
    passportTax: number;
    cnicTax: number;
  }[];
}

export const LIVE_RATES: LiveRatesData = {
  gold: {
    k24Tola: 284500,
    k22Tola: 260790,
    k21Tola: 248935,
    k18Tola: 213375,
    silverTola: 3500,
    silverGram: 300,
  },
  fuel: {
    petrol: 260.60,
    diesel: 265.80,
    lpgKg: 245.50,
    cngKg: 200.00,
  },
  construction: {
    cementBag50kg: 1420,
    steelGrade60Kg: 262,
    steelGrade60Ton: 262000,
    redBricks1000: 14500,
    sandRavi100cft: 3200,
    sandChenab100cft: 4800,
    crushMargalla100cft: 7500,
    crushSargodha100cft: 6800,
    laborGreySqft: 480,
    laborFinishingSqft: 420,
    greyStructureSqft: 2850,
    turnkeyFinishingSqft: 5200,
  },
  solar: {
    panelWattAvg: 30, // Rs 30 / Watt Tier-1
    inverterOnGridWattAvg: 18,
    inverterHybridWattAvg: 24,
    netMeteringFeeEst: 85000, // DISCO test, demand notice, 3-phase meter, NOC
    genUnitsPerKwMonthly: 130, // 130 kWh per kW installed per month
  },
  currency: {
    usd: 278.50,
    sar: 74.20,
    aed: 75.80,
    gbp: 355.20,
    eur: 298.40,
  },
  nepraTariff: {
    protected: {
      slab1to100: 7.74,
      slab101to200: 14.16,
    },
    unprotected: {
      slab1to100: 16.48,
      slab101to200: 22.95,
      slab201to300: 27.14,
      slab301to700: 35.24,
      slab700plus: 42.72,
    },
    fpaEstimatedPerUnit: 3.25,
    electricityDutyPct: 1.5,
    generalSalesTaxPct: 18.0,
    tvFee: 35,
    nonFilerTaxThreshold: 25000,
    nonFilerTaxPct: 7.5,
  },
  gasSngpl: {
    protectedSlabs: [
      { maxHm3: 0.5, ratePerHm3: 200, fixedCharge: 400 },
      { maxHm3: 1.0, ratePerHm3: 300, fixedCharge: 400 },
      { maxHm3: 1.5, ratePerHm3: 400, fixedCharge: 400 },
      { maxHm3: 2.0, ratePerHm3: 500, fixedCharge: 400 },
      { maxHm3: 3.0, ratePerHm3: 600, fixedCharge: 400 },
      { maxHm3: 4.0, ratePerHm3: 800, fixedCharge: 400 },
      { maxHm3: 999, ratePerHm3: 1100, fixedCharge: 400 },
    ],
    unprotectedSlabs: [
      { maxHm3: 0.5, ratePerHm3: 500, fixedCharge: 1000 },
      { maxHm3: 1.0, ratePerHm3: 850, fixedCharge: 1000 },
      { maxHm3: 1.5, ratePerHm3: 1250, fixedCharge: 1000 },
      { maxHm3: 2.0, ratePerHm3: 2000, fixedCharge: 1000 },
      { maxHm3: 3.0, ratePerHm3: 3000, fixedCharge: 1000 },
      { maxHm3: 4.0, ratePerHm3: 3500, fixedCharge: 1000 },
      { maxHm3: 999, ratePerHm3: 4200, fixedCharge: 1000 },
    ],
    meterRent: 40,
  },
  motorwayTolls: [
    { route: "M-2", name: "Islamabad – Lahore Motorway", fromTo: "Zero Point Islamabad to Thokar Niaz Baig Lahore (367 km)", carToll: 1100, wagonToll: 1800, coasterToll: 2500, busToll: 3600, truck2Axle: 4700 },
    { route: "M-1", name: "Islamabad – Peshawar Motorway", fromTo: "Islamabad Toll to Peshawar Ring Road (155 km)", carToll: 450, wagonToll: 750, coasterToll: 1100, busToll: 1600, truck2Axle: 2100 },
    { route: "M-3", name: "Lahore – Abdul Hakeem Motorway", fromTo: "M-2 Junction to Abdul Hakeem (230 km)", carToll: 750, wagonToll: 1250, coasterToll: 1750, busToll: 2500, truck2Axle: 3200 },
    { route: "M-5", name: "Multan – Sukkur Motorway", fromTo: "Multan interchange to Sukkur (392 km)", carToll: 1250, wagonToll: 2050, coasterToll: 2900, busToll: 4100, truck2Axle: 5400 },
    { route: "M-9", name: "Karachi – Hyderabad Motorway", fromTo: "Sohrab Goth Karachi to Jamshoro Hyderabad (136 km)", carToll: 420, wagonToll: 700, coasterToll: 1000, busToll: 1450, truck2Axle: 1900 },
    { route: "M-15", name: "Hazara Motorway (Hasan Abdal – Thakot)", fromTo: "Burhan M-1 to Thakot (180 km)", carToll: 550, wagonToll: 900, coasterToll: 1300, busToll: 1850, truck2Axle: 2400 },
    { route: "M-14", name: "Hakla – D.I. Khan Motorway (CPEC)", fromTo: "Hakla to Yarik D.I. Khan (285 km)", carToll: 850, wagonToll: 1400, coasterToll: 2000, busToll: 2800, truck2Axle: 3700 },
    { route: "Swat", name: "Swat Expressway (Colonel Sher Khan – Chakdara)", fromTo: "KPK (160 km)", carToll: 380, wagonToll: 600, coasterToll: 850, busToll: 1200, truck2Axle: 1600 },
  ],
  ptaTaxSlabs: [
    { brand: "Apple", model: "iPhone 16 Pro Max (1TB / 512GB)", usdCfValue: 1200, passportTax: 135500, cnicTax: 162500 },
    { brand: "Apple", model: "iPhone 16 / 15 Pro", usdCfValue: 999, passportTax: 122000, cnicTax: 148000 },
    { brand: "Apple", model: "iPhone 15 / 14 (Standard)", usdCfValue: 799, passportTax: 108000, cnicTax: 132000 },
    { brand: "Apple", model: "iPhone 13 / 12", usdCfValue: 599, passportTax: 86000, cnicTax: 110000 },
    { brand: "Samsung", model: "Galaxy S25 Ultra / S24 Ultra", usdCfValue: 1199, passportTax: 132000, cnicTax: 159000 },
    { brand: "Samsung", model: "Galaxy S24 / S23", usdCfValue: 799, passportTax: 98000, cnicTax: 124000 },
    { brand: "Samsung", model: "Galaxy A55 / A35", usdCfValue: 350, passportTax: 42000, cnicTax: 56000 },
    { brand: "Google", model: "Pixel 9 Pro / 8 Pro", usdCfValue: 899, passportTax: 112000, cnicTax: 138000 },
    { brand: "Xiaomi", model: "Xiaomi 14 / 13T Pro", usdCfValue: 650, passportTax: 78000, cnicTax: 98000 },
    { brand: "OnePlus", model: "OnePlus 12 / 11", usdCfValue: 700, passportTax: 84000, cnicTax: 106000 },
  ],
};
