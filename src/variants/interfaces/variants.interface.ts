import { ModuleTypes } from "../../common/enums/module.enum";
import { IIdentity } from "../../common/interfaces/identity.interface";
import { IModule } from "../../common/interfaces/module.interface";

export interface IVariantData {
  tag: string
  displayName: string
}

export interface IVariant extends IModule<IVariantData> {
  tag: string
  moduleType: ModuleTypes.VARIANTS
  identity: IIdentity
  main: IVariantData
}

