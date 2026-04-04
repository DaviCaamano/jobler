import Papa from 'papaparse';

type Row = Record<string, string>;

export const csvToJsonArray = (csv: string): Promise<Row[]> => {
    return new Promise((resolve, reject) => {
        try {
            const result = Papa.parse<Record<string, string>>(csv, {
                header: true,
                skipEmptyLines: true,
            });
            resolve(result.data);
        } catch (e: unknown) {
            reject(e instanceof Error ? e : new Error(String(e)));
        }
    });
};
