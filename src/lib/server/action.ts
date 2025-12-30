"use server";

import { getUniformData } from "@/lib/uniform";
import { getNonUniformData } from "@/lib/nonuniform";
import { getSortedData } from "@/lib/unsorted";
import prisma from "@/lib/prisma";
import {
  Datatype,
  Algorithm,
  DatasetSize,
  FieldToSearch,
} from "@/generated/prisma/client";
import { google } from "googleapis";

export async function fetchData(type: string, quantity: string) {
  let response;
  if (type === "UNIFORM") {
    response = await getUniformData(quantity);
  } else if (type === "NONUNIFORM") {
    response = await getNonUniformData(quantity);
  } else {
    response = await getSortedData(quantity);
  }
  return Array.isArray(response) ? response : [];
}

export async function saveAnalysisResult(data: {
  iterations: number;
  itemsFound: number;
  executionTimeMs: number;
  startSearchAt: Date;
  endSearchAt: Date;
  datatype: string;
  algorithm: string;
  datasetSize: string;
  fieldToSearch: string;
  searchValue: string;
}) {
  const datatypeMap: Record<string, Datatype> = {
    UNIFORM: Datatype.UNIFORM,
    NONUNIFORM: Datatype.NONUNIFORM,
    UNSORTED: Datatype.UNSORTED,
  };

  const algorithmMap: Record<string, Algorithm> = {
    linear: Algorithm.LINEAR_SEARCH,
    binary: Algorithm.BINARY_SEARCH,
    interpolation: Algorithm.INTERPOLATION_SEARCH,
  };

  const sizeMap: Record<string, DatasetSize> = {
    ONETHOUSAND: DatasetSize.SIZE_1K,
    FIVETHOUSAND: DatasetSize.SIZE_5K,
    TENTHOUSAND: DatasetSize.SIZE_10K,
  };

  const fieldMap: Record<string, FieldToSearch> = {
    nim: FieldToSearch.NIM,
    nama: FieldToSearch.NAMA,
    jurusan: FieldToSearch.JURUSAN,
    alamat: FieldToSearch.ALAMAT,
  };

  return await prisma.analysisResult.create({
    data: {
      iterations: data.iterations,
      itemsFound: data.itemsFound,
      executionTimeMs: data.executionTimeMs,
      startSearchAt: data.startSearchAt,
      endSearchAt: data.endSearchAt,
      datatype: datatypeMap[data.datatype],
      algorithm: algorithmMap[data.algorithm],
      datasetSize: sizeMap[data.datasetSize],
      fieldToSearch: fieldMap[data.fieldToSearch],
      searchValue: data.searchValue,
      refrenceDataset: `${data.datatype}_${data.datasetSize}`,
    },
  });
}

export async function exportToGoogleSheets() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS!),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const allAnalysis = await prisma.analysisResult.findMany({
      orderBy: [
        { datasetSize: "asc" },
        { fieldToSearch: "asc" },
        { startSearchAt: "desc" },
      ],
    });

    if (allAnalysis.length === 0) {
      return { success: false, message: "No data found" };
    }

    const values: any[][] = [];
    let currentSize = "";
    let currentField = "";
    const headerRows: number[] = [];
    const subHeaderRows: number[] = [];

    allAnalysis.forEach((item) => {
      if (item.datasetSize !== currentSize) {
        currentSize = item.datasetSize;
        currentField = "";
        values.push([]);
        headerRows.push(values.length);
        values.push([`>>> DATASET SIZE: ${currentSize} <<<`]);
      }

      if (item.fieldToSearch !== currentField) {
        currentField = item.fieldToSearch;
        values.push([]);
        subHeaderRows.push(values.length);
        values.push([`FIELD SEARCH: ${currentField}`]);
        values.push([
          "Timestamp",
          "Algorithm",
          "Data Type",
          "Search Value",
          "Execution Time (ms)",
          "Iterations",
          "Items Found",
        ]);
      }

      values.push([
        item.startSearchAt.toLocaleString(),
        item.algorithm.toUpperCase(),
        item.datatype,
        item.searchValue,
        item.executionTimeMs.toFixed(6),
        item.iterations,
        item.itemsFound,
      ]);
    });

    const targetSheet = "AnalysisData";
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet = spreadsheet.data.sheets?.find(s => s.properties?.title === targetSheet);
    
    if (!sheet) throw new Error(`Sheet "${targetSheet}" not found`);
    const sheetId = sheet.properties?.sheetId;

    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `${targetSheet}!A1:Z10000`,
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${targetSheet}!A1`,
      valueInputOption: "RAW",
      requestBody: { values },
    });

    const requests: any[] = [
      {
        repeatCell: {
          range: { sheetId, startRowIndex: 0, endRowIndex: values.length, startColumnIndex: 0, endColumnIndex: 7 },
          cell: { 
            userEnteredFormat: { 
              verticalAlignment: "MIDDLE", 
              horizontalAlignment: "CENTER",
              textFormat: { fontSize: 10 } 
            } 
          },
          fields: "userEnteredFormat(verticalAlignment,horizontalAlignment,textFormat)"
        }
      }
    ];

    headerRows.forEach(rowIdx => {
      requests.push({
        repeatCell: {
          range: { sheetId, startRowIndex: rowIdx, endRowIndex: rowIdx + 1, startColumnIndex: 0, endColumnIndex: 7 },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.1, green: 0.1, blue: 0.1 },
              textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 12 },
              horizontalAlignment: "CENTER",
              verticalAlignment: "MIDDLE"
            }
          },
          fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
        }
      });
    });

    subHeaderRows.forEach(rowIdx => {
      requests.push({
        repeatCell: {
          range: { sheetId, startRowIndex: rowIdx, endRowIndex: rowIdx + 2, startColumnIndex: 0, endColumnIndex: 7 },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.95, green: 0.95, blue: 0.95 },
              textFormat: { bold: true },
              horizontalAlignment: "CENTER",
              verticalAlignment: "MIDDLE",
              borders: { bottom: { style: "SOLID_MEDIUM" } }
            }
          },
          fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,borders)"
        }
      });
    });

    requests.push({
      autoResizeDimensions: {
        dimensions: { sheetId, dimension: "COLUMNS", startIndex: 0, endIndex: 7 }
      }
    });

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests }
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to export and style");
  }
}