"""populate serial numbers

Revision ID: f94d11ca5327
Revises: e94d11ca5326
Create Date: 2025-02-24 14:30:36.434377

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
import uuid

# revision identifiers, used by Alembic.
revision: str = 'f94d11ca5327'
down_revision: Union[str, None] = 'e94d11ca5326'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Create connection
    connection = op.get_bind()
    
    # Update documents
    documents = table('documents',
        column('id', sa.Integer),
        column('serial_number', sa.String)
    )
    for document in connection.execute(sa.select(documents)).fetchall():
        if not document.serial_number:
            connection.execute(
                documents.update().
                where(documents.c.id == document.id).
                values(serial_number=f"DOC-{uuid.uuid4().hex[:8].upper()}")
            )
    
    # Update items
    items = table('items',
        column('id', sa.Integer),
        column('serial_number', sa.String)
    )
    for item in connection.execute(sa.select(items)).fetchall():
        if not item.serial_number:
            connection.execute(
                items.update().
                where(items.c.id == item.id).
                values(serial_number=f"ITM-{uuid.uuid4().hex[:8].upper()}")
            )

def downgrade() -> None:
    # No downgrade needed as we're just populating data
    pass
