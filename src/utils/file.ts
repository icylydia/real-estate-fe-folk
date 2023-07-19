import { ModelFile } from 'src/api';
import CategoryEnum = ModelFile.CategoryEnum;

export const useFile = () => {
  const describeCategory = (category: CategoryEnum) => {
    switch (category) {
      case CategoryEnum.Contract:
        return '契約書';
      case CategoryEnum.PropertyManagement:
        return '資産管理・物件管理';
      case CategoryEnum.RentalManagement:
        return '賃貸借管理';
      case CategoryEnum.Insurance:
        return '保険';
      case CategoryEnum.Tax:
        return '税務';
      case CategoryEnum.Loan:
        return 'ローン・融資';
      case CategoryEnum.Construction:
        return '工事関係';
      case CategoryEnum.Other:
        return 'その他';
    }
  }
  return {
    describeCategory,
  }
}
