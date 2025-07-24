import React, { useState, useEffect } from 'react';
import { BankingData } from '../types/engagement-types';
import { arrayToCSV, csvToArray, downloadCSV } from '../utils/csv-utils';
import { Download, Upload, Search } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts';

interface BankingDataTabProps {
  data: BankingData[];
}

const BankingDataTab: React.FC<BankingDataTabProps> = ({ data }) => {
  const [filteredData, setFilteredData] = useState(data);
  // Sync filteredData with data prop
  useEffect(() => {
    setFilteredData(data);
  }, [data]);
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    category: ''
  });
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');

  useEffect(() => {
    let filtered = data;
    if (filters.search) {
      filtered = filtered.filter(
        (item) =>
          item.accountName
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          item.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(
        (item) => new Date(item.date) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(
        (item) => new Date(item.date) <= new Date(filters.dateTo)
      );
    }
    if (filters.category) {
      filtered = filtered.filter((item) => item.category === filters.category);
    }
    setFilteredData(filtered);
  }, [data, filters]);

  const accounts = Array.from(
    new Map(
      data.map((item) => [
        item.accountId,
        { accountId: item.accountId, accountName: item.accountName }
      ])
    ).values()
  );
  const accountBalances = accounts.map((acc) => {
    const accTxs = data.filter((item) => item.accountId === acc.accountId);
    const latest = accTxs.reduce(
      (a, b) => (new Date(a.date) > new Date(b.date) ? a : b),
      accTxs[0]
    );
    return { ...acc, balance: latest ? latest.balance : 0 };
  });
  const chartAccountId = selectedAccountId || accounts[0]?.accountId || '';
  const chartData = data
    .filter((item) => item.accountId === chartAccountId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const categories = Array.from(new Set(data.map((item) => item.category)));

  return (
    <div className='space-y-6'>
      <div className='bg-card dark:bg-card border-border mb-4 rounded-lg border p-6 transition-colors'>
        <h3 className='mb-2 text-lg font-semibold'>Bank Accounts Linked</h3>
        <div className='flex flex-wrap gap-4'>
          {accountBalances.map((acc) => (
            <div
              key={acc.accountId}
              className={`border-border bg-background cursor-pointer rounded-lg border p-4 transition-colors €{chartAccountId === acc.accountId ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedAccountId(acc.accountId)}
            >
              <div className='text-foreground font-medium'>
                {acc.accountName}
              </div>
              <div className='text-muted-foreground text-sm'>
                ID: {acc.accountId}
              </div>
              <div className='mt-1 text-lg font-bold text-blue-600 dark:text-blue-400'>
                €{acc.balance.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Card className='mb-4'>
        <CardHeader>
          <CardTitle>Balance Chart</CardTitle>
          <CardDescription>
            Balance over time for the selected account
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-2'>
          {chartData.length > 1 ? (
            <ChartContainer
              config={{
                balance: { label: 'Balance', color: 'var(--primary)' }
              }}
              className='h-[200px] w-full'
            >
              <ResponsiveContainer width='100%' height={200}>
                <LineChart
                  data={chartData}
                  margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='date'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={80}
                  />
                  <Line
                    type='monotone'
                    dataKey='balance'
                    stroke='var(--primary)'
                    strokeWidth={2}
                    dot={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className='text-muted-foreground'>
              Not enough data for chart.
            </div>
          )}
        </CardContent>
      </Card>
      <div className='flex items-center justify-between'>
        <h2 className='text-foreground text-xl font-semibold'>
          Banking Data (Plaid)
        </h2>
        <div className='flex items-center gap-2'>
          <button
            className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700'
            onClick={() =>
              downloadCSV('banking-data.csv', arrayToCSV(filteredData))
            }
          >
            <Download className='h-4 w-4' />
            Export Data
          </button>
          <label className='inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'>
            <Upload className='h-4 w-4' />
            Import Data
            <input
              type='file'
              accept='.csv'
              className='hidden'
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const text = await file.text();
                const imported = csvToArray<BankingData>(text);
                setFilteredData(imported);
                localStorage.setItem('bankingData', JSON.stringify(imported));
                window.location.reload();
              }}
            />
          </label>
        </div>
      </div>
      <div className='bg-card dark:bg-card border-border rounded-lg border p-6 transition-colors'>
        <div className='flex flex-wrap items-center gap-4'>
          <div className='relative'>
            <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
            <input
              type='text'
              placeholder='Search accounts or description...'
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className='border-border bg-background text-foreground placeholder-muted-foreground rounded-lg border py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <input
            type='date'
            value={filters.dateFrom}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
            }
            className='border-border bg-background text-foreground rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500'
          />
          <input
            type='date'
            value={filters.dateTo}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
            }
            className='border-border bg-background text-foreground rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500'
          />
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
            className='border-border bg-background text-foreground rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500'
          >
            <option value=''>All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='bg-card dark:bg-card border-border overflow-hidden rounded-lg border transition-colors'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 dark:bg-gray-700'>
              <tr>
                <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-left text-xs font-medium tracking-wider uppercase'>
                  Date
                </th>
                <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-left text-xs font-medium tracking-wider uppercase'>
                  Account
                </th>
                <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-left text-xs font-medium tracking-wider uppercase'>
                  Description
                </th>
                <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-right text-xs font-medium tracking-wider uppercase'>
                  Amount
                </th>
                <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-left text-xs font-medium tracking-wider uppercase'>
                  Type
                </th>
                <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-left text-xs font-medium tracking-wider uppercase'>
                  Category
                </th>
                <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-right text-xs font-medium tracking-wider uppercase'>
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className='bg-card dark:bg-card divide-border divide-y'>
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className='hover:bg-muted dark:hover:bg-card/80'
                >
                  <td className='text-foreground bg-card dark:bg-card border-border border-b px-6 py-4 text-sm whitespace-nowrap'>
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className='text-foreground bg-card dark:bg-card border-border border-b px-6 py-4 text-sm whitespace-nowrap'>
                    {item.accountName}
                  </td>
                  <td className='text-foreground bg-card dark:bg-card border-border border-b px-6 py-4 text-sm'>
                    {item.description}
                  </td>
                  <td className='text-foreground bg-card dark:bg-card border-border border-b px-6 py-4 text-right text-sm whitespace-nowrap'>
                    {item.type === 'debit' ? '-' : '+'}€
                    {item.amount.toLocaleString()}
                  </td>
                  <td className='px-6 py-4 text-sm whitespace-nowrap'>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        item.type === 'credit'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}
                    >
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </td>
                  <td className='text-foreground bg-card dark:bg-card border-border border-b px-6 py-4 text-sm whitespace-nowrap'>
                    {item.category}
                  </td>
                  <td className='text-foreground bg-card dark:bg-card border-border border-b px-6 py-4 text-right text-sm whitespace-nowrap'>
                    €{item.balance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BankingDataTab;
