export interface AssetModule {
    readonly info: ModuleInfo;
    readonly supportedChains: string[];
    validate(data: any): ValidationResult;
    generateContract(data: any): ContractTemplate;
  }
  
  export interface ModuleInfo {
    id: string;
    name: string;
    version: string;
    category: string;
  }
  
  export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
  }
  
  export interface ValidationError {
    field: string;
    message: string;
  }
  
  export interface ContractTemplate {
    bytecode: string;
    abi: any[];
    constructorArgs: any[];
  }