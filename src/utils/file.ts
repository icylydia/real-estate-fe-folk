import { FileBase } from 'src/api';
import CategoryEnum = FileBase.CategoryEnum;

export const useFile = () => {
  const describeCategory = (category: CategoryEnum) => {
    switch (category) {
      case CategoryEnum.Contract:
        return '契約書類';
      case CategoryEnum.ApplicationForm:
        return '申込書';
      case CategoryEnum.Insurance:
        return '保険関係';
      case CategoryEnum.Construction:
        return '工事修繕';
      case CategoryEnum.Tax:
        return '税務関係';
      case CategoryEnum.InspectionReport:
        return '点検報告';
      case CategoryEnum.WorkReport:
        return '作業報告';
      case CategoryEnum.MonthlyReport:
        return '月次報告書';
      case CategoryEnum.Receipt:
        return '領収書';
      case CategoryEnum.Bill:
        return '請求書';
      case CategoryEnum.Estimate:
        return '見積書';
      case CategoryEnum.IncomeDetail:
        return '収入明細';
      case CategoryEnum.CleaningReport:
        return '清掃報告';
      case CategoryEnum.Other:
        return 'その他';
    }
  }
  return {
    describeCategory,
  }
}
