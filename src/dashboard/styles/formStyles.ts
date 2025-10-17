export const formStyles = {
  formContainer: "bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden",

  section: "p-6 space-y-6",

  sectionHeader: "flex items-center space-x-3 mb-6 pb-4 border-b border-neutral-200",
  sectionTitle: "text-lg font-semibold text-neutral-900",
  sectionIcon: "h-5 w-5 text-primary-600",

  formGroup: "space-y-2",

  label: "block text-sm font-medium text-neutral-700 mb-2",
  requiredLabel: "block text-sm font-medium text-neutral-700 mb-2 after:content-['*'] after:ml-0.5 after:text-red-500",

  input: `
    w-full px-4 py-3
    border border-neutral-300 rounded-xl
    bg-white
    text-neutral-900
    placeholder-neutral-400
    transition-all duration-200
    focus:ring-2 focus:ring-primary-500 focus:border-primary-500
    hover:border-primary-300
    disabled:bg-neutral-50 disabled:cursor-not-allowed
  `.trim().replace(/\s+/g, ' '),

  textarea: `
    w-full px-4 py-3
    border border-neutral-300 rounded-xl
    bg-white
    text-neutral-900
    placeholder-neutral-400
    transition-all duration-200
    focus:ring-2 focus:ring-primary-500 focus:border-primary-500
    hover:border-primary-300
    resize-none
    disabled:bg-neutral-50 disabled:cursor-not-allowed
  `.trim().replace(/\s+/g, ' '),

  select: `
    w-full px-4 py-3
    border border-neutral-300 rounded-xl
    bg-white
    text-neutral-900
    transition-all duration-200
    focus:ring-2 focus:ring-primary-500 focus:border-primary-500
    hover:border-primary-300
    disabled:bg-neutral-50 disabled:cursor-not-allowed
  `.trim().replace(/\s+/g, ' '),

  checkbox: `
    h-5 w-5
    text-primary-600
    border-neutral-300 rounded
    transition-colors duration-200
    focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
  `.trim().replace(/\s+/g, ' '),

  radioGroup: "grid grid-cols-1 sm:grid-cols-2 gap-3",

  radioOption: `
    relative flex items-center p-4
    rounded-xl border-2
    cursor-pointer
    transition-all duration-200
  `.trim().replace(/\s+/g, ' '),

  radioOptionSelected: "border-primary-500 bg-primary-50",
  radioOptionUnselected: "border-neutral-200 hover:border-neutral-300 bg-white",

  error: "mt-1 text-sm text-red-600 flex items-center space-x-1",

  buttonGroup: "flex items-center justify-between space-x-3 pt-6 border-t border-neutral-200",

  buttonSecondary: `
    px-6 py-3
    text-neutral-700 font-medium
    border-2 border-neutral-300 rounded-xl
    transition-all duration-200
    hover:bg-neutral-50 hover:border-neutral-400
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
  `.trim().replace(/\s+/g, ' '),

  buttonPrimary: `
    px-8 py-3
    bg-gradient-to-r from-primary-600 to-primary-700
    text-white font-semibold rounded-xl
    shadow-md
    transition-all duration-200
    hover:shadow-lg hover:from-primary-700 hover:to-primary-800
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center space-x-2
  `.trim().replace(/\s+/g, ' '),

  buttonDanger: `
    px-6 py-3
    bg-gradient-to-r from-red-600 to-red-700
    text-white font-semibold rounded-xl
    shadow-md
    transition-all duration-200
    hover:shadow-lg hover:from-red-700 hover:to-red-800
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center space-x-2
  `.trim().replace(/\s+/g, ' '),

  tag: `
    inline-flex items-center
    px-3 py-1.5
    rounded-full text-sm font-medium
    bg-primary-100 text-primary-800
    transition-colors duration-200
    hover:bg-primary-200
  `.trim().replace(/\s+/g, ' '),

  tagRemoveButton: "ml-2 text-primary-600 hover:text-primary-800 transition-colors duration-150",

  imagePreview: "mt-3 relative rounded-xl overflow-hidden border-2 border-neutral-200 shadow-sm",

  toggleContainer: "flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200",

  helpText: "text-xs text-neutral-500 mt-1",

  divider: "border-t border-neutral-200 my-6"
}
