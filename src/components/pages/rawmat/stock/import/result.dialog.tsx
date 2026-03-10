import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Database, Timer, Package } from "lucide-react";

interface ResultDialogProps {
    result: any;
    dryRun: boolean;
}

export function ResultDialog({ result, dryRun }: ResultDialogProps) {
    const { stats, duration, importId } = result;

    return (
        <Dialog open={true}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>Import Results</DialogTitle>
                        <Badge variant={dryRun ? "outline" : "default"}>
                            {dryRun ? "DRY RUN" : "LIVE IMPORT"}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Summary */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    {dryRun ? (
                                        <AlertCircle className="h-5 w-5 text-blue-500" />
                                    ) : (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    )}
                                    <h3 className="font-semibold">
                                        {dryRun ? "Simulation Complete" : "Import Successful"}
                                    </h3>
                                </div>
                                <Badge variant="secondary">ID: {importId?.slice(0, 8)}</Badge>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                {dryRun
                                    ? "This was a simulation. No data was saved to the database."
                                    : "Data has been successfully imported into the database."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center space-y-2">
                                    <Database className="h-8 w-8 mx-auto text-blue-500" />
                                    <p className="text-2xl font-bold">{stats?.total || 0}</p>
                                    <p className="text-sm text-gray-500">Total Processed</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center space-y-2">
                                    <Package className="h-8 w-8 mx-auto text-green-500" />
                                    <p className="text-2xl font-bold text-green-600">
                                        {stats?.created || 0}
                                    </p>
                                    <p className="text-sm text-gray-500">Created</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center space-y-2">
                                    <Package className="h-8 w-8 mx-auto text-yellow-500" />
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {stats?.updated || 0}
                                    </p>
                                    <p className="text-sm text-gray-500">Updated</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center space-y-2">
                                    <Timer className="h-8 w-8 mx-auto text-purple-500" />
                                    <p className="text-2xl font-bold">{duration || "N/A"}</p>
                                    <p className="text-sm text-gray-500">Duration</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Details */}
                    <Card>
                        <CardContent className="pt-6">
                            <h4 className="font-semibold mb-3">Import Details</h4>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <dt className="text-sm text-gray-500">Import ID</dt>
                                    <dd className="font-mono text-sm truncate">{importId}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Mode</dt>
                                    <dd>{dryRun ? "Dry Run (Simulation)" : "Live Import"}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Success Rate</dt>
                                    <dd>
                                        {stats?.total
                                            ? `${(
                                                  ((stats.created + stats.updated) / stats.total) *
                                                  100
                                              ).toFixed(1)}%`
                                            : "N/A"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Timestamp</dt>
                                    <dd>{new Date().toLocaleString()}</dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
                        >
                            New Import
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800"
                        >
                            Download Report
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
