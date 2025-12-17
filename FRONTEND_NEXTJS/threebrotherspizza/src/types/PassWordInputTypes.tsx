/* định kiểu types cho tsx của file passWordInput.tsx trong mục components */
export interface PasswordInputTypes {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}