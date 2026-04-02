import { parseString } from '@fast-csv/parse';

type Row = Record<string, string>;

export const csvToJsonArray = async (csv: string): Promise<Row[]> => {
    return await new Promise((resolve, reject) => {
        const rows: Row[] = [];

        parseString(csv, { headers: true })
            .on('error', reject)
            .on('data', (row: Row) => rows.push(row))
            .on('end', () => resolve(rows));
    });
};
