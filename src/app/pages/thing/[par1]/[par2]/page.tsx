export default function Page({
  params,
}: {
  params: { par1: string; par2: string };
}) {
  return (
    <div>
      <h1>{params.par1}</h1>
      <h1>{params.par2}</h1>
    </div>
  );
}
