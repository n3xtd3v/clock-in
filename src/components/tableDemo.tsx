import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";

export function TableDemo() {
  const { timestamps } = useSelector((state: any) => state.timestamp);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>Display Name</TableHead>
          <TableHead>Timestamp Type</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Image</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timestamps.map((timestamp: any, index: number) => (
          <TableRow key={timestamp.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{timestamp.displayName}</TableCell>
            <TableCell>{timestamp.timestampType}</TableCell>
            <TableCell>
              {timestamp.createdAt.slice(0, 10) +
                " " +
                timestamp.createdAt.slice(11, 19)}
            </TableCell>
            <TableCell>
              {timestamp.imageURL ? (
                <img src={timestamp.imageURL} width={200} alt="photo" />
              ) : (
                "No image"
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
