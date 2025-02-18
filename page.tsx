"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CopyIcon, RefreshCwIcon as RefreshIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { faker } from "@faker-js/faker/locale/zh_CN"

interface Identity {
  id: number
  name: string
  gender: string
  idNumber: string
  birthDate: string
  zodiac: string
  constellation: string
  age: number
  region: string
  areaCode: string
  phone: string
  bankCard: string
  bank: string
}

// 省份和城市的映射
const provinceCityMap: { [key: string]: string[] } = {
  "11": ["北京"],
  "31": ["上海"],
  "44": [
    "广州",
    "深圳",
    "珠海",
    "汕头",
    "韶关",
    "佛山",
    "江门",
    "湛江",
    "茂名",
    "肇庆",
    "惠州",
    "梅州",
    "汕尾",
    "河源",
    "阳江",
    "清远",
    "东莞",
    "中山",
    "潮州",
    "揭阳",
    "云浮",
  ],
  "33": ["杭州", "宁波", "温州", "嘉兴", "湖州", "绍兴", "金华", "衢州", "舟山", "台州", "丽水"],
}

const provinceMap: { [key: string]: string } = {
  "11": "北京市",
  "31": "上海市",
  "44": "广东省",
  "33": "浙江省",
}

const bankPrefixMap: { [key: string]: string } = {
  "621": "中国工商银行",
  "622": "中国农业银行",
  "623": "中国建设银行",
  "625": "中国银行",
  "628": "交通银行",
  "626": "中信银行",
  "627": "中国光大银行",
  "629": "招商银行",
  "630": "中国民生银行",
  "631": "平安银行",
}

export default function IdentityGenerator() {
  const [identities, setIdentities] = useState<Identity[]>(() => generateMockData(10))
  const [count, setCount] = useState(10)
  const { toast } = useToast()

  function generateMockData(count: number): Identity[] {
    return Array.from({ length: count }, (_, i) => {
      const provinceCode = faker.helpers.objectKey(provinceCityMap) as keyof typeof provinceCityMap
      const cityName = faker.helpers.arrayElement(provinceCityMap[provinceCode])
      const birthDate = faker.date.between({ from: "1940-01-01", to: "2005-12-31" })
      const idNumber = generateIdNumber(provinceCode, birthDate)
      const bankPrefix = faker.helpers.arrayElement(Object.keys(bankPrefixMap))
      const bankCard = bankPrefix + faker.finance.creditCardNumber("############")
      const bank = bankPrefixMap[bankPrefix]

      return {
        id: i + 1,
        name: faker.person.fullName(),
        gender: Number.parseInt(idNumber.charAt(16)) % 2 === 0 ? "女" : "男",
        idNumber: idNumber,
        birthDate: birthDate.toISOString().split("T")[0],
        zodiac: getChineseZodiac(birthDate),
        constellation: getConstellation(birthDate),
        age: new Date().getFullYear() - birthDate.getFullYear(),
        region: `${provinceMap[provinceCode]}${cityName}${faker.location.street()}`,
        areaCode: provinceCode + faker.number.int({ min: 1000, max: 9999 }).toString(),
        phone: generatePhoneNumber(),
        bankCard: bankCard,
        bank: bank,
      }
    })
  }

  function generateIdNumber(provinceCode: string, birthDate: Date): string {
    const year = birthDate.getFullYear().toString()
    const month = (birthDate.getMonth() + 1).toString().padStart(2, "0")
    const day = birthDate.getDate().toString().padStart(2, "0")
    const random = faker.number.int({ min: 100, max: 999 }).toString()
    const gender = faker.number.int({ min: 0, max: 9 }).toString()
    const checksum = faker.number.int({ min: 0, max: 9 }).toString()
    return `${provinceCode}0101${year}${month}${day}${random}${gender}${checksum}`
  }

  function generatePhoneNumber(): string {
    const prefixes = [
      "130",
      "131",
      "132",
      "133",
      "134",
      "135",
      "136",
      "137",
      "138",
      "139",
      "150",
      "151",
      "152",
      "153",
      "155",
      "156",
      "157",
      "158",
      "159",
      "170",
      "176",
      "177",
      "178",
      "180",
      "181",
      "182",
      "183",
      "184",
      "185",
      "186",
      "187",
      "188",
      "189",
    ]
    return faker.helpers.arrayElement(prefixes) + faker.number.int({ min: 10000000, max: 99999999 }).toString()
  }

  function getChineseZodiac(date: Date): string {
    const zodiacSigns = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"]
    const year = date.getFullYear()
    return zodiacSigns[(year - 4) % 12]
  }

  function getConstellation(date: Date): string {
    const constellations = [
      "摩羯座",
      "水瓶座",
      "双鱼座",
      "白羊座",
      "金牛座",
      "双子座",
      "巨蟹座",
      "狮子座",
      "处女座",
      "天秤座",
      "天蝎座",
      "射手座",
    ]
    const month = date.getMonth()
    const day = date.getDate()
    const constellationDays = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22]
    return constellations[day < constellationDays[month] ? (month + 11) % 12 : month]
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
    toast({
      description: "已复制到剪贴板",
      duration: 2000,
    })
  }

  function handleRefresh() {
    setIdentities(generateMockData(count))
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">身份信息生成器</h1>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshIcon className="mr-2 h-4 w-4" />
          重新生成
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <Label htmlFor="count">生成数量</Label>
          <Input
            id="count"
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            min="1"
            max="100"
          />
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>序号</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>性别</TableHead>
              <TableHead>身份证号</TableHead>
              <TableHead>出生日期</TableHead>
              <TableHead>生肖</TableHead>
              <TableHead>星座</TableHead>
              <TableHead>年龄</TableHead>
              <TableHead>地区</TableHead>
              <TableHead>手机号</TableHead>
              <TableHead>银行卡号</TableHead>
              <TableHead>开户行</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {identities.map((identity) => (
              <TableRow key={identity.id}>
                <TableCell>{identity.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {identity.name}
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(identity.name)}>
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{identity.gender}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {identity.idNumber}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopy(identity.idNumber)}
                    >
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{identity.birthDate}</TableCell>
                <TableCell>{identity.zodiac}</TableCell>
                <TableCell>{identity.constellation}</TableCell>
                <TableCell>{identity.age}</TableCell>
                <TableCell>{identity.region}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {identity.phone}
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(identity.phone)}>
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {identity.bankCard}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopy(identity.bankCard)}
                    >
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{identity.bank}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

