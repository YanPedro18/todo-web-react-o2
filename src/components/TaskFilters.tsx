import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TaskFilters as TaskFiltersType, TaskStatus, TaskPriority, TaskSortBy, SortOrder } from '@/types/task';
import { Search, X, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  sortBy: TaskSortBy;
  setSortBy: (sortBy: TaskSortBy) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  taskStats: {
 total: number;
  'a fazer': number;
  'em andamento': number;
  'concluído': number;
  };
}

export const TaskFilters = ({
  filters,
  onFiltersChange,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  taskStats,
}: TaskFiltersProps) => {
  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  const clearFilters = () => {
    onFiltersChange({});
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="text-center p-3 bg-accent/50 rounded-lg">
          <div className="text-2xl font-bold text-foreground">{taskStats.total}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
        <div className="text-center p-3 bg-todo/10 rounded-lg">
          <div className="text-2xl font-bold text-todo">{taskStats['a fazer']}</div>
          <div className="text-xs text-todo/70">A Fazer</div>
        </div>
        <div className="text-center p-3 bg-doing/10 rounded-lg">
          <div className="text-2xl font-bold text-doing">{taskStats['em andamento']}</div>
          <div className="text-xs text-doing/70">Fazendo</div>
        </div>
        <div className="text-center p-3 bg-done/10 rounded-lg">
          <div className="text-2xl font-bold text-done">{taskStats.concluído}</div>
          <div className="text-xs text-done/70">Concluído</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tarefas..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value || undefined })}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.status || 'all'}
          onValueChange={(value) => 
            onFiltersChange({ ...filters, status: value === 'all' ? undefined : value as TaskStatus })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            <SelectItem value="a fazer">A Fazer</SelectItem>
            <SelectItem value="em andamento">Fazendo</SelectItem>
            <SelectItem value="concluído">Concluído</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priority || 'all'}
          onValueChange={(value) => 
            onFiltersChange({ ...filters, priority: value === 'all' ? undefined : value as TaskPriority })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Prioridades</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
            <SelectItem value="média">Média</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value: TaskSortBy) => setSortBy(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Criado em</SelectItem>
              <SelectItem value="dueDate">Data de Vencimento</SelectItem>
              <SelectItem value="priority">Prioridade</SelectItem>
              <SelectItem value="title">Título</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortOrder}
            className={cn(sortOrder === 'desc' && "bg-accent")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Busca: {filters.search}
              <button
                onClick={() => onFiltersChange({ ...filters, search: undefined })}
                className="hover:bg-background/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <button
                onClick={() => onFiltersChange({ ...filters, status: undefined })}
                className="hover:bg-background/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.priority && (
            <Badge variant="secondary" className="gap-1">
              Prioridade: {filters.priority}
              <button
                onClick={() => onFiltersChange({ ...filters, priority: undefined })}
                className="hover:bg-background/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Limpar todos
          </Button>
        </div>
      )}
    </div>
  );
};