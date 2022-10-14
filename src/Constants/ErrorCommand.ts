const ErrorCommand = (FileName:string) => {
    return{
        "python" : `npx pyright ./LintFolder/${FileName}.py`
    }
}

export default ErrorCommand;