export const workspaceAccentColors = ['#0058BE', '#5a6072', '#8A3D00'] as const

export function getWorkspaceAccent(index: number) {
  return workspaceAccentColors[index % workspaceAccentColors.length]
}
