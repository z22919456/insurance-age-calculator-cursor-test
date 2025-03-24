"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Home() {
  const [birthDate, setBirthDate] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [gender, setGender] = useState("male");
  const [result, setResult] = useState<number | null>(null);
  const [actualAge, setActualAge] = useState<{
    years: number;
    months: number;
  } | null>(null);

  // 設定預設計算日期為今天
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setTargetDate(formattedDate);
  }, []);

  const calculateInsuranceAge = () => {
    if (!birthDate || !targetDate) return;

    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    // 計算實際年齡
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();

    // 調整月份差
    if (months < 0) {
      years--;
      months += 12;
    }

    // 如果日期還沒到，月份減1
    if (target.getDate() < birth.getDate()) {
      months--;
      if (months < 0) {
        years--;
        months += 12;
      }
    }

    setActualAge({ years, months });

    // 計算保險年齡
    let insuranceAge = years;

    // 如果超過6個月，保險年齡加1
    if (months > 6) {
      insuranceAge++;
    }

    setResult(insuranceAge);
  };

  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          台灣保險年齡計算器 (Cursor AI 提供)
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>請輸入您的資料</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="birthDate">出生日期</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDate">計算日期</Label>
              <Input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
              <p className="text-sm text-slate-500">
                預設計算到今天，您可以選擇其他日期
              </p>
            </div>

            <div className="space-y-2">
              <Label>性別</Label>
              <RadioGroup
                value={gender}
                onValueChange={setGender}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">男性</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">女性</Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              className="w-full"
              onClick={calculateInsuranceAge}
              disabled={!birthDate}
            >
              計算保險年齡
            </Button>

            {result !== null && actualAge !== null && (
              <div className="mt-6 p-4 bg-slate-100 rounded-lg space-y-4">
                <h2 className="text-xl font-semibold mb-2">計算結果</h2>
                <div className="space-y-2">
                  <p className="text-lg">
                    實際年齡：{actualAge.years} 歲 {actualAge.months} 個月
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    保險年齡：{result} 歲
                  </p>
                </div>
                <div className="mt-4 text-sm text-slate-600">
                  <p>※ 保險年齡計算規則：</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>以足歲計算</li>
                    <li>超過6個月則加算1歲</li>
                    <li>未滿6個月則維持原足歲</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
