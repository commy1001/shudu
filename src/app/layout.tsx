import './globals.css'; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;// ReactNode 是一个类型，表示任何类型的 React 节点
}) {
  return (
    <html lang="en">
      <body>
        
        {children}
       
      </body>
    </html>
  );
}