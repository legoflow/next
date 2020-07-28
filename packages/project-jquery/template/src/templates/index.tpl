<!DOCTYPE html>
<html lang="zh-cmn-Hans">
  <title>{{ title }}</title>
<body>
  {{if page == 1}}
    {{ include './page/page-1.tpl' }}
  {{/if}}

  {{if page == 2}}
    {{ include './page/page-2.tpl' }}
  {{/if}}
</body>
</html>
