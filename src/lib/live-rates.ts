/**
 * Centralized Live Rates & Market Benchmarks for Pakistan (Updated 2026)
 * Accurate government schedules, Karachi Sarafa Association & State Bank benchmarks.
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
  psx: {
    kse100: number;
    change: number;
    changePct: number;
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
    cad: number;
    aud: number;
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
    k24Tola: 304500, // Latest Karachi Sarafa 2026 Rate
    k22Tola: 279120,
    k21Tola: 266430,
    k18Tola: 228375,
    silverTola: 3450,
    silverGram: 296,
  },
  fuel: {
    petrol: 264.80, // Latest OGRA Fuel Schedule
    diesel: 272.40,
    lpgKg: 250.80,
    cngKg: 210.00,
  },
  psx: {
    kse100: 113820.40, // Pakistan Stock Exchange KSE-100 High
    change: 640.80,
    changePct: 0.57,
  },
  construction: {
    cementBag50kg: 1480,
    steelGrade60Kg: 260,
    steelGrade60Ton: 260000,
    redBricks1000: 15500,
    sandRavi100cft: 3600,
    sandChenab100cft: 5200,
    crushMargalla100cft: 8200,
    crushSargodha100cft: 7400,
    laborGreySqft: 520,
    laborFinishingSqft: 460,
    greyStructureSqft: 2950,
    turnkeyFinishingSqft: 5500,
  },
  solar: {
    panelWattAvg: 29, // Rs 29 / Watt Tier-1 N-Type TopCon
    inverterOnGridWattAvg: 17,
    inverterHybridWattAvg: 23,
    netMeteringFeeEst: 85000, // DISCO test, demand notice, 3-phase green meter
    genUnitsPerKwMonthly: 135, // 135 kWh per kW installed per month in Pakistan
  },
  currency: {
    usd: 280.15, // Latest Interbank / Open Market Average
    sar: 74.65,
    aed: 76.25,
    gbp: 369.40,
    eur: 308.50,
    cad: 205.80,
    aud: 184.20,
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
      { maxHm3: 0.25, ratePerHm3: 200, fixedCharge: 400 },
      { maxHm3: 0.5, ratePerHm3: 250, fixedCharge: 400 },
      { maxHm3: 0.6, ratePerHm3: 300, fixedCharge: 400 },
      { maxHm3: 0.9, ratePerHm3: 350, fixedCharge: 800 },
      { maxHm3: 999, ratePerHm3: 400, fixedCharge: 1000 },
    ],
    unprotectedSlabs: [
      { maxHm3: 0.25, ratePerHm3: 500, fixedCharge: 1000 },
      { maxHm3: 0.5, ratePerHm3: 850, fixedCharge: 1000 },
      { maxHm3: 0.6, ratePerHm3: 1250, fixedCharge: 1000 },
      { maxHm3: 0.9, ratePerHm3: 1450, fixedCharge: 1000 },
      { maxHm3: 1.5, ratePerHm3: 1900, fixedCharge: 1500 },
      { maxHm3: 2.0, ratePerHm3: 3300, fixedCharge: 2000 },
      { maxHm3: 3.0, ratePerHm3: 3800, fixedCharge: 2000 },
      { maxHm3: 4.0, ratePerHm3: 4200, fixedCharge: 2000 },
      { maxHm3: 999, ratePerHm3: 4500, fixedCharge: 2000 },
    ],
    meterRent: 50,
  },
  motorwayTolls: [
    { route: "M-2", name: "Lahore - Islamabad Motorway", fromTo: "Thokar Niaz Baig to Islamabad Toll Plaza (375 km)", carToll: 1250, wagonToll: 1850, coasterToll: 2550, busToll: 3600, truck2Axle: 4800 },
    { route: "M-3", name: "Lahore - Abdul Hakeem Motorway", fromTo: "M-2 Jathekey to Darkhana (230 km)", carToll: 850, wagonToll: 1300, coasterToll: 1750, busToll: 2500, truck2Axle: 3300 },
    { route: "M-4", name: "Pindi Bhattian - Multan Motorway", fromTo: "Pindi Bhattian to Multan (286 km)", carToll: 1000, wagonToll: 1500, coasterToll: 2050, busToll: 2900, truck2Axle: 3900 },
    { route: "M-5", name: "Multan - Sukkur Motorway", fromTo: "Multan to Sukkur (392 km)", carToll: 1350, wagonToll: 2000, coasterToll: 2700, busToll: 3900, truck2Axle: 5200 },
    { route: "M-9", name: "Karachi - Hyderabad Motorway", fromTo: "Sohrab Goth to Hyderabad (136 km)", carToll: 550, wagonToll: 800, coasterToll: 1100, busToll: 1600, truck2Axle: 2200 },
    { route: "M-1", name: "Islamabad - Peshawar Motorway", fromTo: "Islamabad to Peshawar Ring Road (155 km)", carToll: 600, wagonToll: 900, coasterToll: 1250, busToll: 1800, truck2Axle: 2400 },
    { route: "M-14", name: "Hakla - D.I. Khan (CPEC Motorway)", fromTo: "Hakla (M-1) to Yarik / D.I. Khan (285 km)", carToll: 950, wagonToll: 1400, coasterToll: 1950, busToll: 2800, truck2Axle: 3750 },
    { route: "M-11", name: "Lahore - Sialkot Motorway", fromTo: "Kala Shah Kaku to Sambrial (103 km)", carToll: 450, wagonToll: 650, coasterToll: 900, busToll: 1300, truck2Axle: 1750 },
  ],
  ptaTaxSlabs: [
    { brand: "Apple", model: "iPhone 16 Pro Max", usdCfValue: 1199, passportTax: 142500, cnicTax: 174000 },
    { brand: "Apple", model: "iPhone 15 Pro Max", usdCfValue: 1099, passportTax: 135700, cnicTax: 165800 },
    { brand: "Apple", model: "iPhone 14 Pro Max", usdCfValue: 999, passportTax: 128500, cnicTax: 156000 },
    { brand: "Apple", model: "iPhone 13 Pro Max", usdCfValue: 799, passportTax: 118000, cnicTax: 142000 },
    { brand: "Samsung", model: "Galaxy S24 Ultra", usdCfValue: 1299, passportTax: 125000, cnicTax: 152000 },
    { brand: "Samsung", model: "Galaxy S23 Ultra", usdCfValue: 899, passportTax: 112000, cnicTax: 138000 },
    { brand: "Google", model: "Pixel 9 Pro XL", usdCfValue: 999, passportTax: 98000, cnicTax: 124000 },
    { brand: "Google", model: "Pixel 8 Pro", usdCfValue: 799, passportTax: 88500, cnicTax: 112000 },
    { brand: "Xiaomi", model: "Xiaomi 14 Ultra", usdCfValue: 899, passportTax: 78000, cnicTax: 98000 },
    { brand: "OnePlus", model: "OnePlus 12 5G", usdCfValue: 799, passportTax: 82000, cnicTax: 104000 },
  ],
};
