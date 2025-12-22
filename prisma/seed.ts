import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const CSV_FILES = [
  'raw_material_10k.csv',
  'manufacturer_10k.csv',
  'distributor_10k.csv',
  'retailer_10k.csv',
  'formulator_10k.csv',
  'packager_10k.csv',
  'cro_10k.csv',
  'trader_10k.csv',
];

const DATASET_PATH = path.join(__dirname, '..', 'dataset');
const BATCH_SIZE = 500;

interface CSVRow {
  Our_ID: string;
  Native_id: string;
  gst_number: string;
  'Company Name': string;
  'Category(Search)': string;
  Entity: string;
  Functionalities: string;
  Address: string;
  HQ_Country_City_Address: string;
  profile_url: string;
  catalog_mobile_url: string;
  Year_Of_Establishment: string;
  Ownership_Type: string;
  Employee_Size: string;
  Revenue_Range: string;
  Main_Channels: string;
  Markets_Served: string;
  Sustainability_Traceability_Notes: string;
  Certifications: string;
  Confidence_Rating: string;
  Key_Contact_Person_Designation: string;
  Key_Contact_Person: string;
  email: string;
  Production_Sites: string;
  Export_Destinations: string;
  Key_Clients: string;
  'Source_URLs': string;
  Collection_Date: string;
  Recent_News: string;
  Short_Overview: string;
  Product_Portfolio: string;
  map_url: string;
  Country: string;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === '') return null;

  // Try DD-MM-YYYY format
  const ddmmyyyy = dateStr.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  // Try YYYY-MM-DD format
  const yyyymmdd = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (yyyymmdd) {
    const [, year, month, day] = yyyymmdd;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  return null;
}

function parseYear(yearStr: string): number | null {
  if (!yearStr || yearStr.trim() === '') return null;
  const year = parseInt(yearStr, 10);
  return isNaN(year) ? null : year;
}

function cleanString(str: string): string | null {
  if (!str || str.trim() === '') return null;
  return str.trim();
}

function mapRowToCompany(row: CSVRow) {
  return {
    our_id: cleanString(row.Our_ID),
    native_id: cleanString(row.Native_id),
    gst_number: cleanString(row.gst_number),
    company_name: cleanString(row['Company Name']),
    category_search: cleanString(row['Category(Search)']),
    entity: cleanString(row.Entity),
    functionalities: cleanString(row.Functionalities),
    address: cleanString(row.Address),
    hq_country_city_address: cleanString(row.HQ_Country_City_Address),
    profile_url: cleanString(row.profile_url),
    catalog_mobile_url: cleanString(row.catalog_mobile_url),
    year_of_establishment: parseYear(row.Year_Of_Establishment),
    ownership_type: cleanString(row.Ownership_Type),
    employee_size: cleanString(row.Employee_Size),
    revenue_range: cleanString(row.Revenue_Range),
    main_channels: cleanString(row.Main_Channels),
    markets_served: cleanString(row.Markets_Served),
    sustainability_traceability_notes: cleanString(row.Sustainability_Traceability_Notes),
    certifications: cleanString(row.Certifications),
    confidence_rating: cleanString(row.Confidence_Rating),
    key_contact_person_designation: cleanString(row.Key_Contact_Person_Designation),
    key_contact_person: cleanString(row.Key_Contact_Person),
    email: cleanString(row.email),
    production_sites: cleanString(row.Production_Sites),
    export_destinations: cleanString(row.Export_Destinations),
    key_clients: cleanString(row.Key_Clients),
    source_urls: cleanString(row['Source_URLs']),
    collection_date: parseDate(row.Collection_Date),
    recent_news: cleanString(row.Recent_News),
    short_overview: cleanString(row.Short_Overview),
    product_portfolio: cleanString(row.Product_Portfolio),
    map_url: cleanString(row.map_url),
    country: cleanString(row.Country),
  };
}

async function parseCSV(filePath: string): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    const rows: CSVRow[] = [];

    fs.createReadStream(filePath)
      .pipe(parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_quotes: true,
        relax_column_count: true,
      }))
      .on('data', (row: CSVRow) => {
        rows.push(row);
      })
      .on('end', () => {
        resolve(rows);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function seedFromCSV(fileName: string): Promise<number> {
  const filePath = path.join(DATASET_PATH, fileName);

  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️  File not found: ${fileName}, skipping...`);
    return 0;
  }

  console.log(`  📄 Processing ${fileName}...`);

  const rows = await parseCSV(filePath);
  const companies = rows.map(mapRowToCompany);

  let insertedCount = 0;

  // Insert in batches
  for (let i = 0; i < companies.length; i += BATCH_SIZE) {
    const batch = companies.slice(i, i + BATCH_SIZE);

    try {
      const result = await prisma.companies.createMany({
        data: batch,
        skipDuplicates: true,
      });
      insertedCount += result.count;
    } catch (error) {
      console.error(`  ❌ Error inserting batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error);
    }
  }

  console.log(`  ✅ Inserted ${insertedCount} records from ${fileName}`);
  return insertedCount;
}

async function main() {
  console.log('🚀 Starting database seed...\n');

  // Step 1: Delete all existing data
  console.log('🗑️  Deleting existing data from companies table...');
  const deleteResult = await prisma.companies.deleteMany({});
  console.log(`  ✅ Deleted ${deleteResult.count} existing records\n`);

  // Step 2: Import data from all CSV files
  console.log('📥 Importing data from CSV files...\n');

  let totalInserted = 0;

  for (const fileName of CSV_FILES) {
    const count = await seedFromCSV(fileName);
    totalInserted += count;
  }

  console.log('\n========================================');
  console.log(`✨ Seed completed successfully!`);
  console.log(`📊 Total records inserted: ${totalInserted}`);
  console.log('========================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
