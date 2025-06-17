export interface AssetModule {
    readonly supportedChains: string[];
    validate(data: any): ValidationResult;
    generateContract(data: any): ContractTemplate;
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