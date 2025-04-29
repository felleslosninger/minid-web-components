// https://custom-elements-manifest.open-wc.org/analyzer/config/#cli-options
export default {
  globs: ['src/**/*.ts'],
  exclude: ['src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  outdir: './',
  dev: false,
  watch: false,
  dependencies: false,
  litelement: true,
  plugins: [
    // Filter private fields
    {
      name: 'web-components-private-fields-filter',
      analyzePhase({ ts, node, moduleDoc }) {
        switch (node.kind) {
          case ts.SyntaxKind.ClassDeclaration: {
            const className = node.name.getText();
            const classDoc = moduleDoc?.declarations?.find(
              (declaration) => declaration.name === className
            );

            if (classDoc?.members) {
              classDoc.members = classDoc.members.filter(
                (member) => !member.privacy
              );
            }
          }
        }
      },
    },
  ],
};
