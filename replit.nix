{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.nodePackages.typescript
    pkgs.nodePackages.typescript-language-server
    pkgs.libuuid
    pkgs.cairo
    pkgs.pango
    pkgs.librsvg
    pkgs.pixman
    pkgs.pkg-config
  ];
}
