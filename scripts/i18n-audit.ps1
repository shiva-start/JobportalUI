$patterns = @(
  '>\s*[A-Za-z][^<]{2,}<',
  'placeholder="[^"]*[A-Za-z][^"]*"',
  'aria-label="[^"]*[A-Za-z][^"]*"',
  "toast\.(success|error|info|warning)\('",
  'label:\s*''[^'']*[A-Za-z][^'']*''',
  'title:\s*''[^'']*[A-Za-z][^'']*'''
)

foreach ($pattern in $patterns) {
  Write-Host "`n=== $pattern ==="
  rg -n $pattern src/app --glob "*.html" --glob "*.ts"
}
